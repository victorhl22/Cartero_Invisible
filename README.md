# 📮 El Cartero Invisible — Documentación del Proyecto

Este repositorio contiene el desarrollo del proyecto **El Cartero Invisible**, estructurado semanalmente bajo la metáfora de una **Oficina de Correos Virtual**.

- **Semana 1:** «Obrim l'oficina de correus» (Montaje del entorno de desarrollo, primer endpoint GET, estructuras semánticas y JavaScript básico).
- **Semana 2:** «Adreces, sobres i un taulell viu» (Manipulación dinámica del DOM, rutas con parámetros path/query en FastAPI y el Modelo de Caja CSS).

---

## 📁 Estructura del Proyecto

```text
cartero-invisible/
├── backend/                  # Servidor API con Python y FastAPI
│   ├── main.py               # Código fuente con los endpoints
│   ├── requirements.txt      # Dependencias de Python (FastAPI, Uvicorn, Pytest, HTTPX)
│   └── tests/                # Pruebas unitarias del servidor
│       └── test_main.py
├── frontend/                 # Cliente web (HTML, CSS, JS)
│   ├── index.html            # Estructura semántica HTML5
│   ├── style.css             # Estilos CSS y Modelo de Caja
│   └── script.js             # Lógica e interacción con el DOM
├── package.json              # Configuración y dependencias de testing JS (Jest, JSDOM)
└── README.md                 # Documentación detallada del proyecto

Semana 1: Fundamentos de JavaScript
Variables:

const: Declaración por defecto para valores que no cambian.

let: Para variables cuyo valor debe reasignarse.

var: Obsoleto y evitado por problemas de ámbito (scope).

Tipos de Datos Primitivos y Complejos: string, number (enteros y decimales), boolean, null, undefined, array ([]) y object ({}).

Funciones: Declaración clásica (function saluda()) y funciones flecha modernas (const suma = (a, b) => a + b).

Eventos: Escucha de eventos con addEventListener("click", callback) para reaccionar a interacciones.

Atributo defer: Imprescindible al enlazar <script src="script.js" defer></script> para asegurar que el script se ejecute únicamente cuando todo el HTML haya cargado.

Semana 2: Manipulación del DOM (Document Object Model)
Selección de Elementos:

querySelector("selector"): Devuelve el primer elemento del DOM que coincide con un selector CSS (ID, clase o etiqueta).

querySelectorAll("selector"): Devuelve una lista (NodeList) con todos los elementos coincidentes.

Modificación de Contenido y Seguridad:

textContent: Lee o inserta texto plano. Es totalmente seguro contra inyecciones de código.

innerHTML: Interpreta e inserta código HTML. Debe usarse con precaución para evitar vulnerabilidades XSS (Cross-Site Scripting).

Estilos y Atributos:

Modificación de estilos directos mediante element.style.propiedad (en sintaxis camelCase, ej. style.color, style.backgroundColor).

Gestión de atributos HTML:

setAttribute('atributo', 'valor'): Añade o modifica el valor de un atributo.

getAttribute('atributo'): Obtiene el valor actual de un atributo.

removeAttribute('atributo'): Elimina un atributo del elemento.

Gestión de Clases (classList):

classList.add('clase'): Añade una clase CSS.

classList.remove('clase'): Elimina una clase CSS.

classList.toggle('clase'): Alterna la clase (la quita si existe, la añade si no).

🟩 Módulo 07 — FastAPI y Backend (El Cartero y la API)
💡 Teoría y Analogías
FastAPI representa al cartero y el servidor a la oficina de correos:

Las rutas/endpoints son las ventanillas de atención.

El servidor recibe las cartas (peticiones HTTP), realiza la gestión y devuelve una respuesta estructurada en JSON.

Uvicorn es la infraestructura/edificio que mantiene la oficina abierta escuchando peticiones en segundo plano.

El entorno virtual (.venv) es una caja de herramientas propia y aislada para no mezclar librerías entre distintos proyectos.

📍 Endpoints Desarrollados
1. Endpoint Principal (Bienvenida)
Método / Ruta: GET /

Descripción: Comprueba que la API está operativa.

Respuesta: {"missatge": "Hola, món!"}

2. Búsqueda por ID (Path Parameters)
Método / Ruta: GET /cartas/{id}

Descripción: Busca una carta concreta según su identificador. FastAPI valida automáticamente que {id} sea un número entero (int). Si no se encuentra, devuelve un error HTTP 404.

3. Listado con Paginación (Query Parameters)
Método / Ruta: GET /cartas?limit=10&offset=0

Descripción: Devuelve la lista de cartas permitiendo filtrar la cantidad (limit) y el punto de inicio (offset).

📩 Base de Datos Simulada (JSON)
JSON
[
  {"id": 1, "remitent": "Maria", "contingut": "Hola, com estàs?"},
  {"id": 2, "remitent": "Joan", "contingut": "T'escric des del passat."},
  {"id": 3, "remitent": "Javier", "contingut": "JAvier ibarra el mejor de españa."},
  {"id": 4, "remitent": "Ali", "contingut": "Tiene como muchos amegos y mobiles."},
  {"id": 5, "remitent": "Sara", "contingut": "La neo exnovia de auonplay."},
  {"id": 6, "remitent": "Iker", "contingut": "El mejor portero del real madrid."}
]