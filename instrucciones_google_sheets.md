# Instrucciones para Integrar el Formulario con Google Sheets

Este documento explica cómo configurar la integración entre el formulario de contacto de tu sitio web y Google Sheets para almacenar automáticamente los mensajes recibidos.

## Paso 1: Crear una Hoja de Cálculo en Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com) y crea una nueva hoja de cálculo
2. Renombra la hoja como "Mensajes de Contacto" o el nombre que prefieras
3. En la primera fila, crea los siguientes encabezados EXACTAMENTE como se muestran (minúsculas):
  - A1: fecha
  - B1: nombre
  - C1: correo
  - D1: telefono
  - E1: servicio
  - F1: mensaje

## Paso 2: Crear un Script de Google Apps Script

1. En tu hoja de cálculo, ve a "Extensiones" > "Apps Script"
2. Elimina todo el código predeterminado y pega el siguiente código:

```javascript
const sheetName = 'Hoja 1'; // Cambia esto si renombraste la hoja
const scriptProp = PropertiesService.getScriptProperties();

function doGet(e) {
  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

function setup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', doc.getId());
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      .map(h => String(h).trim());
    const headerKeys = headers.map(h => h.toLowerCase());
    const nextRow = sheet.getLastRow() + 1;

    // Normalizar parámetros a minúsculas para mapeo robusto
    const params = {};
    Object.keys(e.parameter || {}).forEach(k => {
      params[k.toLowerCase()] = e.parameter[k];
    });

    const newRow = headerKeys.map(h => {
      if (h === 'fecha') return new Date();
      return params[h] ?? '';
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return _jsonResponse({ result: 'success', row: nextRow });
  } catch (err) {
    return _jsonResponse({ result: 'error', error: String(err) }, 500);
  } finally {
    lock.releaseLock();
  }
}

function _jsonResponse(obj, code) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  if (code) output.setContent(JSON.stringify(obj));
  return output;
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
3. Asegúrate de que tu formulario tenga estos ids de campos: `nombre`, `correo`, `telefono` (opcional), `servicio`, `mensaje`. El script ya añade `fecha` automáticamente.
3. Guarda el archivo

## Paso 5: Probar la Integración

1. Abre tu sitio web y ve al formulario de contacto
2. Completa todos los campos y envía el formulario
3. Verifica tu hoja de cálculo de Google Sheets para confirmar que los datos se han registrado correctamente

## Solución de Problemas

Si encuentras algún problema:

- Verifica que la URL del script esté correctamente copiada en el archivo JS
- Asegúrate de que los nombres de los campos en el formulario coincidan con los encabezados en la hoja de cálculo (en minúsculas)
- Revisa la consola del navegador para ver si hay errores JavaScript
- Verifica que tu navegador no esté bloqueando las solicitudes (CORS)

## Notas Importantes

- Esta integración requiere que el usuario tenga una cuenta de Google
- Los datos se almacenarán en tu cuenta personal de Google Drive
- Puedes personalizar la hoja de cálculo y el script según tus necesidades
- Recuerda que hay límites de uso para Google Apps Script (consulta la documentación de Google para más detalles)
