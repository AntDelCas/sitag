export class AppGlobals {

  /** @description: Cabecera inicial de la aplicación. */
  static TEXTO_CABECERA: string = "<p>Si-Tag</p><p>Solución integral para la trazabilidad de elementos de principio a fin.</p>";

  /** @description: Estado de la conexión a internet. */
  static NETWORK_AVAILABLE: boolean = false;

  /** @description: Lista de usuarios descargada del servidor. */
  static USERS_LIST: any;

  /** @description: Lista de usuarios existente en local. */
  static USERS_LIST_LOCAL: any;

  /** @description: Permisos que tiene el usuario sobre los productos. */
  static USER_ACCESIBILITY: any;

  /** @description: Nombre usuario logueado. */
  static USER: string;

  /** @description: Última sincronización de datos con el servidor. */
  static LAST_SYNCHRO: string;

  /** @description: Esquema de productos por defecto. */
  static DEFAULT_SCHEMA: any;

  /** @description: Lista de todos los esquemas (descargable por owner). */
  static SCHEMA_LIST: any;

  /** @description: Datos registrados aún no enviados a la nube. */
  static REGISTER_SHEET: any;

  /** @description: Etiqueta del producto. */
  static PRODUCT_LABEL: string;

  /** @description: Token para la validación de las consultas. */
  static HEADER_TOKEN: string;

  /** @description: El usuario tiene permisos de visualizador. */
  static IS_VISUALIZER: boolean = false;

  /** @description: El usuario tiene permisos de registrador. */
  static IS_REGISTER: boolean = false;

  /** @description: El usuario tiene permisos de owner. */
  static IS_OWNER: boolean = false;
}
