import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AppGlobals } from "../../pages/index.paginas";
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  private database: SQLiteObject;
  //initially set dbReady status to false
  private database_ready = new BehaviorSubject<boolean>(false);

  constructor(
    private platform:Platform,
    private sqlite:SQLite)
    {
    this.platform.ready().then(()=>{
      console.log("Constructor Database");
      this.sqlite.create({
        name: 'users.db',
        location: 'default'
      })
      .then((db:SQLiteObject)=>{
        this.database = db;

        this.createTables().then(()=>{
          this.database_ready.next(true);
        });
      })
    });
  }

  private createTables(){
    return this.database.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        date TEXT,
        user TEXT
      );`
    ,{}).catch((err)=>console.log("Error creando la base de datos.", err));
  }

  private isReady(){
    return new Promise((resolve) =>{
      //if dbReady is true, resolve
      if(this.database_ready.getValue()){
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else{
        this.database_ready.subscribe((ready)=>{
          if(ready){
            resolve();
          }
        });
      }
    })
  }

  addUserToLocal(date:string, user:string){
    this.deleteUser();
    console.log("addUser");
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('INSERT INTO users(date, user) VALUES (?,?);', [date, user]).then((result)=>{
      })
    });
  }

  getUsersFromLocal(){
    console.log("getUsersJSON()");
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("SELECT * from users", [])
      .then((data)=>{

        let usersJSON : any = [];

        if(data.rows.length == 0)
          return false;

        for(let i=0; i<data.rows.length; i++){
          usersJSON.push(data.rows.item(i));
        }

        AppGlobals.USERS_LIST_LOCAL = JSON.parse(usersJSON[0].user);

        return true;
      })
    })
  }

  deleteUser(){
    console.log("deleteUser()")
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("DELETE FROM users", []).then((data)=>{
      });
    })
  }
}
