# 🏥 POS Club MedvitalCo

Sistema de registro de **Aportes** para la Corporación MedvitalCo (asociación sin fines de lucro). Aplicación web en un solo archivo HTML, sin servidor ni instalación.

## Uso

Abrir `index.html` en cualquier navegador (PC, tablet o celular). Por defecto los datos se guardan solo en el navegador del equipo (`localStorage`): usar siempre el mismo equipo y navegador para conservar el historial.

Para que **varios equipos compartan el mismo inventario, socios y ventas**, se puede conectar el POS a un backend gratuito en Google Apps Script + Google Drive (ver sección siguiente). `localStorage` sigue funcionando como caché local aunque esté activada la sincronización.

## Sincronización en la nube (Google Apps Script + Drive)

Arquitectura: `index.html` → Google Apps Script (Web App) → Google Drive (archivo `medvitalco_pos_db.json`).

1. Ir a [script.google.com](https://script.google.com/) → **Proyecto nuevo**.
2. Borrar el contenido de `Code.gs` y pegar el contenido de [`apps-script/Code.gs`](apps-script/Code.gs) de este repositorio.
3. **Configuración del proyecto (ícono ⚙️) → Propiedades del script → Añadir propiedad del script**: nombre `TOKEN`, valor un texto secreto largo (ej. generado con `openssl rand -hex 24`). Este token protege la escritura de datos; no se sube al repositorio.
4. **Implementar → Nueva implementación → tipo: Aplicación web**.
   - Ejecutar como: **Yo** (tu cuenta de Google).
   - Quién tiene acceso: **Cualquier usuario**.
5. Autorizar el acceso a Drive cuando lo pida y copiar la **URL del Web App** (termina en `/exec`).
6. En el POS: pestaña **⚙️ Ajustes** → pegar la URL del Web App y el mismo `TOKEN` del paso 3 → **Guardar**.
7. Repetir el paso 6 en cada equipo/navegador que deba compartir los datos. El indicador junto a la fecha (☁️ Sincronizado / ⚠️ Sin conexión) muestra el estado.

⚠️ El archivo de Drive queda en la cuenta de Google que hizo el despliegue (visible solo para esa cuenta salvo que se comparta explícitamente). El token viaja en cada solicitud: solo compartirlo con quienes deban registrar aportes, y usar HTTPS (Apps Script ya lo entrega por defecto).

⚠️ Si dos equipos guardan cambios al mismo tiempo, gana el último guardado (no hay fusión automática) — pensado para el volumen de un club pequeño, no para alta concurrencia.

### Publicar con GitHub Pages

1. Subir `index.html` y este `README.md` al repositorio.
2. En el repositorio: **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save**.
3. El POS quedará disponible en `https://<usuario>.github.io/<repositorio>/`.

⚠️ Si el repositorio es público, cualquiera con el enlace podrá abrir el POS (los datos de socios NO se comparten: viven solo en el navegador de cada equipo). Para mayor privacidad, usar un repositorio privado con GitHub Pages de pago, o abrir el archivo localmente.

## Funciones

- 🛒 **Caja**: menú de flores (mínimo 5g por variedad), vapos y accesorios; delivery +$5.000; comprobante de aporte imprimible.
- 📦 **Inventario**: stock en tiempo real con alertas, agregar/editar productos.
- 👥 **Socios**: RUT, correo, dirección, teléfono, receta médica con semáforo de vigencia (180 días: 🟢 121–180, 🟡 31–120, 🔴 0–30/vencida), receta adjunta (Anexo B) y cupo de dispensación (60g/mes, 720g/año) con bloqueo automático.
- 🏷️ **Etiqueta de envío**: nombre y dirección, con tamaños de papel térmico configurables (compatible con etiquetadoras como la ZJ-9220).
- 📄 **Documentos por aporte**: recibo de cuota social, mandato de transporte y copia de receta, más código QR enlazable a la documentación en PDF.
- 📊 **Reportes**: aportes por día/semana/mes, gráfico de 7 días y productos con más movimiento.
- 🧾 **Historial**: reimpresión de comprobantes, etiquetas y documentos; anulación con devolución de stock.
