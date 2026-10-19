NekroFloor Box — archivos del proyecto

Incluye:
- index.html: interfaz clásica retro para móvil y PC.
- public/: logo, fondo y dibujos proporcionados.
- api/upload.js: endpoint que intenta enviar los archivos a Catbox.

DESPLIEGUE
1. Sube el contenido de esta carpeta a un repositorio GitHub.
2. Importa el repositorio en Vercel.
3. Vercel detectará package.json y api/upload.js.

LIMITACIONES IMPORTANTES
- Vercel Functions suelen imponer un límite de cuerpo de petición de aproximadamente 4.5 MB. Por eso, aunque la interfaz valida hasta 100 MB y el proxy tiene ese límite configurado, las subidas grandes pueden ser rechazadas por Vercel. Para 100 MB reales necesitas un backend/hosting con streaming y límite compatible, o una integración de almacenamiento que admita cargas directas.
- Esta versión envía los archivos al alojamiento de Catbox; no almacena los archivos en Vercel.
- El botón “Quitar” solo elimina el enlace de la lista del navegador. La API pública de subida de Catbox no ofrece en este código una función general de borrado remoto. Para borrar archivos y hacer que sus enlaces den 404 necesitas almacenamiento propio con base de datos y endpoint de borrado, o una función de borrado autorizada por el proveedor.
- Los formatos que acepta Catbox dependen de sus reglas; la página no puede garantizar que se acepten ejecutables, todos los modelos 3D o cualquier extensión.
