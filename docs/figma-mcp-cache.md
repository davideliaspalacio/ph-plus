# Figma MCP cache workflow

El uso del MCP de Figma es limitado, así que la regla para este proyecto es no consultar el archivo por cada ajuste visual. El flujo recomendado es:

1. Hacer una sola llamada de descubrimiento para traer páginas, frames relevantes, nombres, IDs y assets exportables.
2. Guardar esa respuesta como JSON local en `docs/figma-cache/` o en un archivo temporal dentro del workspace.
3. Usar ese JSON como fuente para implementar y revisar código.
4. Volver a consultar Figma solo cuando el diseño cambie o falte un dato específico.

Cuando el MCP esté disponible, las llamadas deben devolver datos estructurados con `return`, no logs. Ejemplo de extracción mínima:

```js
figma.skipInvisibleInstanceChildren = true;

const page = figma.currentPage;
const frames = page
  .query("FRAME, COMPONENT, COMPONENT_SET")
  .values(["id", "name", "x", "y", "width", "height"]);

return {
  page: { id: page.id, name: page.name },
  frames,
};
```

Para una página concreta, primero se cachean los IDs de página:

```js
return figma.root.children.map((page) => ({
  id: page.id,
  name: page.name,
  children: page.children.length,
}));
```

Luego se consulta solo la página necesaria con `await figma.setCurrentPageAsync(page)` una vez por llamada. No se debe recorrer todo el archivo repetidamente ni cambiar de página dentro de un loop.
