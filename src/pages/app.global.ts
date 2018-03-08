export class AppGlobals {

  static TEXTO_CABECERA: string = "<p>Si-Tag</p><p>Solución integral para la trazabilidad de elementos de principio a fin.</p>";

  //Estado de la conexión a internet:
  static NETWORK_AVAILABLE: boolean = false;

  //Lista de usuarios descargada del servidor:
  static USERS_LIST: any;

  //Lista de usuarios existente en local:
  static USERS_LIST_LOCAL: any;

  //Usuario logueado:
  static USER: string;

  //Última sincronización de datos con el servidor:
  static LAST_SYNCHRO: string;

  //Permisos máximos sobre los objetos:
  static IS_REGISTER: boolean = false;
  static IS_OWNER: boolean = false;
}
