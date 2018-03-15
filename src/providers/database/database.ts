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
    ,{}).then(()=>{
      return this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS default_schema (
          schema TEXT
        );`
      ,{})
    }).then(()=>{
      return this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS register_sheet (
          user TEXT,
          register TEXT
        );`
      ,{})
    })
    .catch((err)=>console.log("Error creando la base de datos.", err));
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

  /////////// USERS
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
      return this.database.executeSql("SELECT * FROM users", [])
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


  /////////// SCHEMA
  getSchemaFromLocal(){
    console.log("getSchemaFromLocal()");
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("SELECT * FROM default_schema", [])
      .then((data)=>{

        let default_schema : any = [];

        if(data.rows.length == 0)
          return false;

        for(let i=0; i<data.rows.length; i++){
          default_schema.push(data.rows.item(i));
        }

        AppGlobals.DEFAULT_SCHEMA = JSON.parse(default_schema[0].schema);

        return true;
      })
    })
  }

  addSchemaToLocal(schema:string){
    this.deleteSchema();
    console.log("addSchema");
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('INSERT INTO default_schema(schema) VALUES (?);', [schema]).then((result)=>{
      })
    });
  }

  deleteSchema(){
    console.log("deleteSchema()")
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("DELETE FROM default_schema", []).then((data)=>{
      });
    })
  }

  /////////// REGISTER
  getRegisterFromLocal(user : string){
    console.log("getRegisterFromLocal()");
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("SELECT * FROM register_sheet WHERE user = ?", [user])
      .then((data)=>{
        let register_sheet : any = [];

        if(data.rows.length == 0)
          return false;

        for(let i=0; i<data.rows.length; i++){
          register_sheet.push(data.rows.item(i));
        }

        AppGlobals.REGISTER_SHEET = JSON.parse(register_sheet[0].register);
        return true;
      })
    })
  }

  addRegisterToLocal(user:string, register:string){
    this.deleteRegister();
    console.log("addRegisterToLocal");
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('INSERT INTO register_sheet(user,register) VALUES (?,?);', [user,register]).then((result)=>{
        console.log(result);
      })
    });
  }

  deleteRegister(){
    console.log("deleteRegister()")
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("DELETE FROM register_sheet", []).then((data)=>{
      });
    })
  }
}
