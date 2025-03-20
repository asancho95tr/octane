# Importación y Análisis de Excel desde Octane ALM

Este proyecto Angular tiene como objetivo permitir la importación de archivos Excel exportados desde Octane ALM, procesarlos y visualizar un reporte detallado de las tareas organizadas por sprints. La aplicación facilita el análisis de las tareas para detectar áreas de mejora, como tareas sin estimar, no asignadas, sin tiempo invertido, no cerradas y una comparación porcentual entre el tiempo estimado y el tiempo invertido.

## Características

- **Importación de Excel**: La aplicación permite importar un archivo Excel exportado desde Octane ALM.
- **Reporte Organizado por Sprints**: Muestra un resumen de las tareas organizadas por sprints para facilitar el seguimiento del progreso.
- **Detección de Tareas**:
  - Tareas que no tienen estimación de tiempo.
  - Tareas no asignadas a ningún trabajador.
  - Tareas sin tiempo invertido.
  - Tareas no cerradas.
  - Comparación porcentual entre el tiempo estimado y el tiempo invertido.
- **Análisis por Persona**: Muestra el tiempo estimado vs el tiempo invertido para cada persona asignada a las tareas.
- **Interactividad**:
  - Al hacer clic en cualquier celda de la tabla (por ejemplo, el número de tareas sin asignación), se mostrará una tabla detallada en la parte inferior con las tareas específicas.
  - La tabla incluirá enlaces a Octane ALM para ver más detalles sobre cada tarea.

## Requisitos

- **Node.js**: Necesario para gestionar las dependencias del proyecto.
- **Angular CLI**: Framework utilizado para el desarrollo de la aplicación.

## Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/asancho95tr/octane.git
   ```

2. **Instalar dependencias**:
   Navega al directorio del proyecto y ejecuta el siguiente comando para instalar las dependencias necesarias.

   ```bash
   npm install
   ```

3. **Ejecutar el servidor de desarrollo**:
   Para iniciar la aplicación en modo desarrollo, ejecuta el siguiente comando:
   ```bash
   npm run start
   ```
   La aplicación estará disponible en [http://localhost:4300](http://localhost:4300).

## Uso

1. **Importación de Excel**:

   - Haz clic en el botón "Importar backlog" en la interfaz de usuario.
   - Selecciona el archivo Excel exportado desde Octane ALM.
   - Los datos se cargarán y procesarán para su visualización.

2. **Navegación en el Reporte**:

   - Las tareas se muestran organizadas por sprints.
   - Las tareas que no han sido estimadas, no están asignadas, tienen tiempo sin invertir, o no han sido cerradas estarán destacadas.
   - La comparación porcentual entre el tiempo estimado y el tiempo invertido estará visible para cada tarea.

3. **Interacción con el Reporte**:
   - Al hacer clic en cualquier celda de la tabla (por ejemplo, el número de tareas sin asignación), se mostrará una tabla detallada en la parte inferior con las tareas específicas.
   - La tabla incluirá enlaces a Octane ALM para ver más detalles sobre cada tarea.

## Scripts de Desarrollo

El proyecto está configurado con varios scripts útiles para facilitar el desarrollo:

- **`npm run start`**: Inicia el servidor de desarrollo en el puerto 4300.
- **`npm run lint`**: Ejecuta el análisis de linting y arregla problemas automáticamente si es posible.
- **`npm run deploy`**: Despliega una [nueva versión](https://asancho95tr.github.io/octane/).

## Tecnologías Utilizadas

- **Angular**: Framework para el desarrollo de la aplicación web.
- **Angular Material**: Librería para la interfaz de usuario (UI).
- **xlsx**: Librería para manejar la importación y lectura de archivos Excel.
- **ngx-toastr**: Para notificaciones de éxito o error.
- **ng2-charts**: Para mostrar gráficas. [Ejemplos](https://www.npmjs.com/package/ng2-charts)

## Contribuciones

Si deseas contribuir al proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama nueva para tus cambios (`git checkout -b nueva-funcionalidad`).
3. Realiza los cambios y asegúrate de que todos los tests pasen.
4. Haz commit de tus cambios (`git commit -am 'Añadir nueva funcionalidad'`).
5. Sube tu rama (`git push origin nueva-funcionalidad`).
6. Abre un Pull Request en GitHub.

---

¡Gracias por usar el proyecto! Si tienes alguna duda o sugerencia, no dudes en abrir un issue en GitHub.
