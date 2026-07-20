/**
 * Backend del POS Club MedvitalCo.
 * Recibe la base de datos completa (productos, socios, ventas, config) como
 * un único JSON y la guarda en un archivo de Google Drive, para que todos
 * los equipos que abren index.html compartan los mismos datos.
 *
 * Despliegue: ver README.md del proyecto.
 */

var NOMBRE_ARCHIVO = 'medvitalco_pos_db.json';

function doGet(e) {
  return manejar(e);
}

function doPost(e) {
  return manejar(e);
}

function manejar(e) {
  var out;
  try {
    var params = (e && e.parameter) || {};
    var body = {};
    if (e && e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); } catch (err) { body = {}; }
    }
    var accion = body.action || params.action;
    var token = body.token || params.token;
    var tokenValido = PropertiesService.getScriptProperties().getProperty('TOKEN');

    if (!tokenValido) {
      out = { ok: false, error: 'El servidor no tiene TOKEN configurado (Project Settings → Script Properties).' };
    } else if (token !== tokenValido) {
      out = { ok: false, error: 'Token inválido' };
    } else if (accion === 'get') {
      out = { ok: true, data: leerDB() };
    } else if (accion === 'save') {
      escribirDB(body.data);
      out = { ok: true };
    } else {
      out = { ok: false, error: 'Acción desconocida' };
    }
  } catch (err) {
    out = { ok: false, error: String(err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function dbVacia() {
  return { productos: [], socios: [], ventas: [], config: {} };
}

function obtenerArchivo() {
  var props = PropertiesService.getScriptProperties();
  var fileId = props.getProperty('FILE_ID');
  if (fileId) {
    try {
      return DriveApp.getFileById(fileId);
    } catch (err) {
      // El archivo fue movido/borrado: se recrea abajo.
    }
  }
  var archivo = DriveApp.createFile(NOMBRE_ARCHIVO, JSON.stringify(dbVacia()), MimeType.PLAIN_TEXT);
  props.setProperty('FILE_ID', archivo.getId());
  return archivo;
}

function leerDB() {
  var archivo = obtenerArchivo();
  var contenido = archivo.getBlob().getDataAsString();
  try {
    return JSON.parse(contenido);
  } catch (err) {
    return dbVacia();
  }
}

function escribirDB(data) {
  if (!data || typeof data !== 'object') throw new Error('Datos inválidos');
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var archivo = obtenerArchivo();
    archivo.setContent(JSON.stringify(data));
  } finally {
    lock.releaseLock();
  }
}
