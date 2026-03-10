# 🌿 Live Poll — Real-Time Voting System

Una aplicación de encuestas en tiempo real construida con **WebSockets**, **React** y **Node.js**. Diseñada con una estética natural "Nature Green" y una interfaz premium.

---

## 🚀 Cómo ejecutar el proyecto (Localmente)

### 1. Clonar e Instalar dependencias

Primero, asegúrate de tener instaladas las dependencias en ambas carpetas:

```bash
# Instalar en el Cliente
cd live-poll/client
npm install

# Instalar en el Servidor
cd ../server
npm install
```

### 2. Ejecutar en Modo Desarrollo (Recomendado para cambios)

Necesitas abrir **dos terminales**:

- **Terminal 1 (Backend):**
  ```bash
  cd live-poll/server
  npm start  # Corre en el puerto 8080
  ```
- **Terminal 2 (Frontend):**
  ```bash
  cd live-poll/client
  npm run dev  # Corre en el puerto 5173 o 5174
  ```

---

## 🛠️ Ejecución en Modo Producción

Para probar la app tal cual como funcionaría en la nube (un solo puerto para todo):

1.  **Construir el frontend:**
    ```bash
    cd live-poll/client
    npm run build
    ```
2.  **Arrancar el servidor unificado:**
    ```bash
    cd ../server
    node index.js
    ```
3.  Abre tu navegador en `http://localhost:8080`.

---

## 🔄 Flujo de Uso (Ejemplo)

La aplicación soporta múltiples salas en tiempo real. Sigue estos pasos para probar el flujo completo:

### Paso 1: Entrar como Host (Anfitrión)

1.  Abre la app e ingresa tu nombre (ej. "Admin").
2.  Ingresa un ID de sala único (ej. `Boda2026`).
3.  Selecciona el rol **👑 Host** y dale a "Enter Room".
4.  **Acción:** Escribe una pregunta (ej. "¿Cuál es el mejor postre?") y añade las opciones (ej. "Pastel", "Helado", "Fruta"). Dale a **🚀 Publish Poll**.

### Paso 2: Entrar como Player (Votante)

1.  En otra pestaña (o desde otro dispositivo), ingresa tu nombre (ej. "Daniel").
2.  **Importante:** Ingresa el **mismo ID de sala** (`Boda2026`).
3.  Selecciona el rol **🎮 Player** y dale a "Enter Room".
4.  **Acción:** Verás la pregunta que el Host publicó. Haz clic en una de las barras para votar.

### Paso 3: Ver Resultados en Vivo

- Tanto el Host como los Players verán cómo las barras de resultados se actualizan **instantáneamente** mediante WebSockets sin necesidad de recargar la página.

---

## 🎨 Paleta de Colores (Nature Green)

- **Sage:** `#A3B18A`
- **Cream:** `#DAD7CD`
- **Forest:** `#588157`
- **Dark Green:** `#3A5A40`
- **Deepest Green:** `#344E41`

---

## 📦 Tecnologías

- **Frontend:** React, Vite, Lucide Icons.
- **Backend:** Node.js, WebSocket (`ws`).
- **Estilos:** Vanilla CSS con Glassmorphism y animaciones.
