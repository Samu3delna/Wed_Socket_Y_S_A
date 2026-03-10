# Sistema de Votación en Tiempo Real - Live Poll

Una aplicación de encuestas en tiempo real construida con WebSockets, React y Node.js. Diseñada con una estética premium "Nature Green" y una interfaz altamente interactiva y responsiva.

---

## Características Principales

- **Comunicación en Tiempo Real:** Actualizaciones instantáneas de datos en todos los clientes conectados a través de WebSockets (utilizando la librería ws nativa), eliminando por completo la necesidad de recargar la página.
- **Arquitectura Basada en Roles:** Flujos de trabajo distintos y separados lógicamente para Anfitriones (creadores de la encuesta) y Jugadores (votantes).
- **Gestión de Salas (Rooms):** Sesiones seguras y aisladas mediante el uso de códigos únicos (Room ID). Múltiples salas pueden operar simultáneamente sin interferencia.
- **Sistema Dinámico de Votación:**
  - Barras de progreso y porcentajes animados en tiempo real.
  - Capacidad para que los Jugadores revoquen su voto y vuelvan a elegir una opción diferente de forma dinámica. El servidor recalcula todo al instante.
  - Resaltado automático de la opción ganadora en cuanto se registran los votos.
- **Internacionalización (i18n) Nativa:** Soporte bilingüe completamente sin dependencias de terceros (Inglés y Español) controlado a través de un estado global.
- **Interfaz y Experiencia de Usuario (UI/UX) Premium:**
  - Efectos visuales de cristal (Glassmorphism) combinados con animaciones CSS muy pulidas.
  - Tipografía moderna cargada directamente desde Google Fonts (Inter y Outfit).
  - Iconografía vectorial profesional impulsada exclusivamente por lucide-react (se ha evitado por completo el uso de emojis clásicos para mantener la consistencia del diseño).

---

## Stack Tecnológico

- **Frontend:** React, Vite, Context API junto con useReducer (para el manejo del estado global), lucide-react (para los iconos).
- **Backend:** Node.js, ws (Librería de WebSockets).
- **Estilos:** Vanilla CSS puro con configuración por variables (CSS Custom Properties).

---

## Instrucciones de Instalación y Ejecución Local

### 1. Requisitos Previos

Asegúrese de tener Node.js instalado en su sistema antes de comenzar.

### 2. Instalación de Dependencias

Es necesario instalar los paquetes tanto para el lado del cliente como para el lado del servidor. Abra su terminal en la raíz del proyecto y ejecute los siguientes comandos:

```bash
# Instalar dependencias del Cliente (Frontend)
cd client
npm install

# Instalar dependencias del Servidor (Backend)
cd ../server
npm install
```

### 3. Iniciar la Aplicación

Deberá ejecutar el cliente y el servidor de manera simultánea usando dos terminales separadas.

**Terminal 1 (Servidor Backend):**

```bash
cd server
npm start
```

Nota: El servidor de WebSockets se iniciará en el puerto 8080 (escuchando en ws://localhost:8080).

**Terminal 2 (Cliente Frontend):**

```bash
cd client
npm run dev
```

Nota: Esto iniciará el entorno de desarrollo de Vite (usualmente en el puerto 5173).

---

## Flujo de Uso Principal

Siga estos pasos para probar la arquitectura de la aplicación en tiempo real:

### Paso 1: Inicializar como Anfitrión (Host)

1. Abra la aplicación en su navegador web.
2. Ingrese su Nombre (por ejemplo, "Administrador").
3. Ingrese un código único para la Sala (por ejemplo, "PROYECTO2026").
4. Seleccione el rol de "Host" (Anfitrión) y haga clic en conectar.
5. Dentro del Panel de Control, escriba una pregunta.
6. Proporcione un mínimo de 2 y un máximo de 4 opciones de respuesta.
7. Haga clic en Publicar para que la pregunta sea visible para todos los integrantes de la sala.

### Paso 2: Unirse como Jugador (Votante)

1. Abra una nueva ventana en modo incógnito, una nueva pestaña, o utilice un dispositivo móvil.
2. Ingrese su Nombre (por ejemplo, "Votante 1").
3. Ingrese exactamente el mismo código de Sala utilizado por el Anfitrión ("PROYECTO2026").
4. Seleccione el rol de "Player" (Jugador) y conéctese.
5. Al conectar, el sistema mostrará inmediatamente la encuesta activa.

### Paso 3: Votación Interactiva

- Haga clic en cualquiera de las opciones para emitir su voto.
- Observe cómo las barras de progreso se actualizan animadamente tanto en su pantalla como en la del Anfitrión.
- Como Jugador, puede presionar el botón de "Volver a Votar" para deshacer su selección actual y elegir una nueva opción. El servidor descontará su voto anterior automáticamente.
- Cualquier usuario puede abandonar la sala en cualquier momento y regresar a la pantalla de conexión principal.

---

## Paleta de Colores Oficial (Tema Nature Green)

La aplicación sigue guías de diseño estrictas basadas en los siguientes códigos hexadecimales:

- Sage: #A3B18A
- Cream: #DAD7CD
- Forest: #588157
- Dark Green: #3A5A40
- Deepest Green: #344E41
