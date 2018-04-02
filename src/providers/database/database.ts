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
  //Inicia dbReady en falso.
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

  /**
    * @name: createTables()
    * @description: Crea las tablas con las que operará la base de datos.
    */
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

  /**
    * @name: isReady()
    * @description: Comprueba si la base de datos está disponible para interactuar con ella.
    */
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

  /////////// USERS ///////////

  /**
    * @name: addUserToLocal(date:string, user:string)
    * @description: Añade a la base de datos local un nuevo usuario.
    * @param: date - timeStamp de cuando se crea el usuario, user - usuario que va a ser creado.
    */
  addUserToLocal(date:string, user:string){
    this.deleteUser();
    console.log("addUser");
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('INSERT INTO users(date, user) VALUES (?,?);', [date, user]).then((result)=>{
      })
    });
  }

  /**
    * @name: getUsersFromLocal()
    * @description: Carga en memoria la lista de usuarios disponibles en la base de datos local.
    */
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

  /**
    * @name: deleteUser()
    * @description: Borra todos los datos de la tabla de usuarios de la base de datos local.
    */
  deleteUser(){
    console.log("deleteUser()")
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("DELETE FROM users", []).then((data)=>{
      });
    })
  }


  /////////// SCHEMA ///////////

  /**
    * @name: getSchemaFromLocal()
    * @description: Descarga el esquema por defecto para visionado de elementos en la aplicación.
    */
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

  /**
    * @name: addSchemaToLocal(schema : string)
    * @description: Añade esquema predeterminado a la base de datos en local de la aplicación.
    * @param: Esquema predeterminado para el visionado de productos.
    */
  addSchemaToLocal(schema:string){
    this.deleteSchema();
    console.log("addSchema");
    return this.isReady()
    .then(()=>{
      return this.database.executeSql('INSERT INTO default_schema(schema) VALUES (?);', [schema]).then((result)=>{
      })
    });
  }

  /**
    * @name: deleteSchema()
    * @description: Borra todos los datos de la tabla de default_schema de la base de datos local.
    */
  deleteSchema(){
    console.log("deleteSchema()")
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("DELETE FROM default_schema", []).then((data)=>{
      });
    })
  }

  /////////// REGISTER ///////////

  /**
    * @name: getRegisterFromLocal(user : string)
    * @description: Consulta en la base de datos local los datos de la hoja de registro de los productos escaneados.
    * @param: Usuario que está utilizando la aplicación (del que se consultan los registros).
    */
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

  /**
    * @name: addRegisterToLocal(user : string, register : string)
    * @description: Añade los datos del producto registrado a la tabla register_sheet
    * @param: user - usuario que está registrando el producto. register - datos del producto registrado.
    */
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

  /**
    * @name: deleteRegister()
    * @description: Borra todos los datos de la tabla register_sheet.
    */
  deleteRegister(){
    console.log("deleteRegister()")
    return this.isReady()
    .then(()=>{
      return this.database.executeSql("DELETE FROM register_sheet", []).then((data)=>{
      });
    })
  }
}
