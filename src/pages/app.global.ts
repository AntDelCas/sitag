export class AppGlobals {

  static TEXTO_CABECERA: string = "<p>Si-Tag</p><p>Solución integral para la trazabilidad de elementos de principio a fin.</p>";

  //Estado de la conexión a internet:
  static NETWORK_AVAILABLE: boolean = false;

  //Lista de usuarios descargada del servidor:
  static USERS_LIST: any;

  //Lista de usuarios existente en local:
  static USERS_LIST_LOCAL: any;

  //Permisos que tiene el usuario sobre los productos:
  static USER_ACCESIBILITY: any;

  //Nombre usuario logueado:
  static USER: string;

  //Última sincronización de datos con el servidor:
  static LAST_SYNCHRO: string;

  //Esquema de productos por defecto
  static DEFAULT_SCHEMA: any;

  //Lista de todos los esquemas (descargable por owner):
  static SCHEMA_LIST: any;

  //Datos registrados aún no enviados a la nube:
  static REGISTER_SHEET: any;

  //Etiqueta del producto
  static PRODUCT_LABEL: string;

  //Permisos máximos sobre los objetos:
  static IS_VISUALIZER: boolean = false;
  static IS_REGISTER: boolean = false;
  static IS_OWNER: boolean = false;
}
