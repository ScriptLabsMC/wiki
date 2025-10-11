Guía de Sistema de Documentación - ScriptLabs

📚 Descripción General

Este sistema permite crear y gestionar templates y documentación de forma estructurada usando archivos JSON. El sistema renderiza automáticamente el contenido Markdown con syntax highlighting.

---

🗂️ Estructura de Archivos

Para Templates

```
src/app/data/templates/
├── particle-system.json
├── basic-addon.json
└── advanced-entity.json
```

Para Documentación

```
src/app/data/docs/
├── guia-inicio-rapido.json
├── api-reference.json
└── mejores-practicas.json
```

---

🎯 Rutas Automáticas

Templates

· Lista: /templates
· Individual: /templates/nombre-del-template

Documentación

· Lista: /docs
· Individual: /docs/nombre-del-doc

---

📝 Esquema JSON Común

Estructura Básica

```json
{
  "slug": "identificador-unico",
  "title": "Título Principal",
  "description": "Descripción breve",
  "category": "categoría",
  "difficulty": "principiante|intermedio|avanzado",
  "author": "Nombre del Autor",
  "tags": ["tag1", "tag2"],
  "created": "DD-MM-AAAA",
  "updated": "DD-MM-AAAA",
  "content": "# Contenido en Markdown\n\nTexto con **formato** completo...",
  "resources": [],
  "files": []
}
```

Estructura Completa

```json
{
  "slug": "mi-contenido",
  "title": "Título Atractivo",
  "description": "Descripción clara y concisa",
  "icon": "🚀", // Opcional - Emoji
  "category": "herramientas|gráficos|tutoriales|etc",
  "difficulty": "principiante|intermedio|avanzado",
  "author": "Tu Nombre",
  "order": 1, // Opcional - Para ordenar
  "tags": ["tag1", "tag2", "tag3"],
  "created": "15-01-2024",
  "updated": "20-01-2024",
  
  "content": "# Contenido Principal\n\nEscribe aquí tu contenido usando **Markdown** completo.\n\n## Características\n- ✅ Lista de características\n- ✅ Más puntos importantes\n\n## Código de Ejemplo\n\n```javascript\nfunction ejemplo() {\n  console.log('Hola Mundo');\n}\n```",
  
  "resources": [
    {
      "name": "Recurso Adicional",
      "url": "https://enlace.com",
      "type": "documentación|video|ejemplo"
    }
  ],
  
  "files": [
    {
      "name": "archivo.js",
      "path": "ruta/del/archivo.js", 
      "language": "javascript",
      "content": "console.log('código aquí');",
      "description": "Descripción del archivo"
    }
  ]
}
```

---

🛠️ Campos Explicados

Campos Obligatorios

Campo Descripción Ejemplo
slug Identificador único URL "mi-template"
title Título visible "Sistema de Partículas"
description Resumen breve "Crea efectos visuales increíbles"
category Categoría principal "gráficos"
content Contenido Markdown "# Título\n\nContenido..."

Campos Opcionales

Campo Descripción
icon Emoji representativo
order Número para ordenar (menor = primero)
resources Array de recursos externos
files Array de archivos de ejemplo

---

📖 Sintaxis Markdown Disponible

Títulos

```markdown
# Título Principal
## Subtítulo  
### Sub-subtítulo
```

Formato de Texto

```markdown
**Negrita**
*Cursiva*
`código inline`
~~tachado~~
```

Listas

```markdown
- Item 1
- Item 2
  - Subitem

1. Paso 1  
2. Paso 2
```

Código con Syntax Highlighting:
Usar \`\`\` y el nombre del lenguaje para markdown (```lenguaje), ejemplo:

Para Javascript:
```javascript
// ```javascript o ```js
function ejemplo() {
  return "código";
}
// ``` ← para cerrar
```

Para JSON (json):
```json
{
  "clave": "valor"
}
```

Tablas

```markdown
| Característica | Descripción |
|----------------|-------------|
| Fácil de usar  | Intuitivo   |
| Potente        | Muchas funciones |
```

Tablas (resultado):
| Característica | Descripción |
|----------------|-------------|
| Fácil de usar  | Intuitivo   |
| Potente        | Muchas funciones |

Enlaces e Imágenes

```markdown
[Texto del enlace](https://ejemplo.com)
![Texto alternativo](https://imagen.com/logo.png)
```

---

🔄 Proceso de Creación

Paso 1: Planificar

```bash
# Definir:
# - Objetivo del contenido
# - Audiencia objetivo  
# - Estructura de secciones
# - Ejemplos prácticos
```

Paso 2: Crear Archivo

```bash
# Para templates
touch src/app/data/templates/mi-nuevo-template.json

# Para documentación  
touch src/app/data/docs/mi-nueva-doc.json
```

Paso 3: Escribir Contenido

- Usar el esquema JSON proporcionado
- Aprovechar Markdown para formato
- Incluir ejemplos de código reales
- Agregar recursos útiles

Paso 4: Probar

```bash
npm run dev
# Visitar http://localhost:3000/templates
# o http://localhost:3000/docs
```

---

💡 Mejores Prácticas

Para Slugs

- ✅ Usar minúsculas
- ✅ Separar con guiones (mi-contenido)
- ✅ Ser descriptivo pero breve
- ❌ Evitar espacios y caracteres especiales

Para Contenido

- ✅ Dividir en secciones claras
- ✅ Usar ejemplos reales y prácticos
- ✅ Incluir casos de uso comunes
- ✅ Mantener un tono consistente

Para Archivos

- ✅ Proporcionar código funcional
- ✅ Comentar el código cuando sea necesario
- ✅ Incluir descripciones claras

---

🗂️ Categorías Sugeridas

Para Templates

- herramientas - Utilidades de desarrollo
- gráficos - Partículas, texturas, modelos
- gameplay - Mecánicas de juego
- ui - Interfaces de usuario
- optimización - Mejora de rendimiento

Para Documentación

- tutoriales - Guías paso a paso
- referencia - Documentación técnica
- guías - Instrucciones completas
- ejemplos - Casos de uso prácticos
- faq - Preguntas frecuentes

---

🎯 Ejemplos de Uso

Template de Herramienta

```json
{
  "slug": "mcbeditor",
  "title": "MCBEDITOR v1.4.2", 
  "description": "Editor de scripts JS para desarrollo de add-ons",
  "category": "herramientas",
  "difficulty": "intermedio",
  "author": "a.j.r._.uribe",
  "tags": ["editor", "javascript", "desarrollo"],
  "content": "# MCBEDITOR\n\nEditor especializado para Minecraft Bedrock..."
}
```

Documentación Técnica

```json
{
  "slug": "api-reference",
  "title": "Referencia de API",
  "description": "Documentación técnica completa de la API",
  "category": "referencia", 
  "difficulty": "avanzado",
  "author": "ScriptLabs Team",
  "content": "# Referencia de API\n\nDocumentación técnica..."
}
```
---

❓ Solución de Problemas

El contenido no se muestra

- Verificar que el archivo JSON sea válido
- Confirmar que slug sea único
- Revisar que la ruta sea correcta

Error de sintaxis

- Validar JSON en [JSONLint](https://jsonlint.com/)
- Verificar comillas y escapes en content

No aparece en la lista

- Confirmar que el archivo esté en la carpeta correcta
- Verificar que tenga los campos obligatorios

---

📞 Soporte

- Documentación: Revisa los ejemplos existentes
- Problemas técnicos: Verifica la consola del navegador
- Sugerencias: Contacta al equipo de desarrollo

¡El sistema está listo para usar! 🚀
