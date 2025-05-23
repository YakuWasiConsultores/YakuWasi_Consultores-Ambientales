# Instrucciones para Integrar el Formulario con Google Sheets

Este documento explica cómo configurar la integración entre el formulario de contacto de tu sitio web y Google Sheets para almacenar automáticamente los mensajes recibidos.

## Paso 1: Crear una Hoja de Cálculo en Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com) y crea una nueva hoja de cálculo
2. Renombra la hoja como "Mensajes de Contacto" o el nombre que prefieras
3. En la primera fila, crea los siguientes encabezados:
   - A1: Fecha
   - B1: Nombre
   - C1: Correo
   - D1: Teléfono
   - E1: Servicio
   - F1: Mensaje

## Paso 2: Crear un Script de Google Apps Script

1. En tu hoja de cálculo, ve a "Extensiones" > "Apps Script"
2. Elimina todo el código predeterminado y pega el siguiente código:

```javascript
var sheetName = 'Hoja 1'; // Cambia esto si renombraste la hoja
var scriptProp = PropertiesService.getScriptProperties();

function doGet(e) {
  return HtmlService.createHtmlOutput('El servicio está funcionando correctamente.');
}

function setup() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', doc.getId());
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var sheet = doc.getSheetByName(sheetName);
    
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;
    
    var newRow = headers.map(function(header) {
      return header === 'fecha' ? new Date() : e.parameter[header];
    });
    
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  finally {
    lock.releaseLock();
  }
}
```

3. Guarda el proyecto con un nombre como "FormularioContacto"

## Paso 3: Configurar el Script

1. Después de guardar, haz clic en el botón "Ejecutar" (▶️) y selecciona la función "setup"
2. Google te pedirá permisos para acceder a tus hojas de cálculo. Haz clic en "Revisar permisos" y luego en "Permitir"
3. Una vez ejecutada la función "setup", ve a "Implementar" > "Nueva implementación"
4. Selecciona "Aplicación web" como tipo
5. Configura:
   - Descripción: "Formulario de Contacto"
   - Ejecutar como: "Yo" (tu cuenta)
   - Quién tiene acceso: "Cualquier persona, incluso anónimo"
6. Haz clic en "Implementar"
7. Copia la URL de la aplicación web que se muestra (será algo como https://script.google.com/macros/s/...)

## Paso 4: Configurar el Sitio Web

1. Abre el archivo `js/google-sheets-form.js` en tu editor
2. Reemplaza `'GOOGLE_SCRIPT_URL'` con la URL que copiaste en el paso anterior, entre comillas
3. Guarda el archivo

## Paso 5: Probar la Integración

1. Abre tu sitio web y ve al formulario de contacto
2. Completa todos los campos y envía el formulario
3. Verifica tu hoja de cálculo de Google Sheets para confirmar que los datos se han registrado correctamente

## Solución de Problemas

Si encuentras algún problema:

- Verifica que la URL del script esté correctamente copiada en el archivo JS
- Asegúrate de que los nombres de los campos en el formulario coincidan con los encabezados en la hoja de cálculo
- Revisa la consola del navegador para ver si hay errores JavaScript
- Verifica que tu navegador no esté bloqueando las solicitudes (CORS)

## Notas Importantes

- Esta integración requiere que el usuario tenga una cuenta de Google
- Los datos se almacenarán en tu cuenta personal de Google Drive
- Puedes personalizar la hoja de cálculo y el script según tus necesidades
- Recuerda que hay límites de uso para Google Apps Script (consulta la documentación de Google para más detalles)
