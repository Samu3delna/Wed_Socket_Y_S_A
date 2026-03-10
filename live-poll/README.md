# Live Poll - Real-Time Voting System

A real-time polling application built with WebSockets, React, and Node.js. Designed with a premium "Nature Green" aesthetic and a highly interactive, responsive interface.

---

## Features

- **Real-Time Communication:** Instantaneous data updates across all connected clients via WebSockets (ws library), completely eliminating the need for page reloads.
- **Role-Based Architecture:** Distinct user workflows for Hosts (poll creators) and Players (voters).
- **Room Management:** Secure and isolated sessions using unique Room ID codes.
- **Dynamic Voting System:**
  - Real-time animated progress bars.
  - Ability for Players to clear their vote and revote dynamically.
  - Automatic winner highlighting when participation starts.
- **Internationalization (i18n):** Native, zero-dependency bilingual support (English and Spanish) via a global state toggle switch.
- **Premium UI/UX:**
  - Glassmorphism effects with subtle CSS animations (pulse, spin, bounce).
  - Modern typography using Inter and Outfit fonts.
  - Vector iconography exclusively powered by lucide-react (no emojis).

---

## Technical Stack

- **Frontend:** React, Vite, Context API / useReducer (State Management), lucide-react (Icons).
- **Backend:** Node.js, `ws` (WebSockets).
- **Styling:** Custom Vanilla CSS with CSS Variables.

---

## How to Run the Project (Locally)

### 1. Requirements

Ensure you have Node.js installed on your system.

### 2. Install Dependencies

You must install the packages for both the client side and the server side. Open your terminal and run the following commands from the project root directory:

```bash
# Install Client Dependencies
cd client
npm install

# Install Server Dependencies
cd ../server
npm install
```

### 3. Start the Application

You will need to run the client and the server simultaneously. Open two separate terminal windows or tabs:

**Terminal 1 (Backend Server):**

```bash
cd server
npm start
```

Note: The WebSocket server will start on port 8080 (ws://localhost:8080).

**Terminal 2 (Frontend Client):**

```bash
cd client
npm run dev
```

Note: This will start the Vite development server (usually on port 5173).

---

## Core Application Flow (Example)

Follow these steps to test the complete real-time architecture:

### Step 1: Initialize the Host

1. Open the application in your browser.
2. Enter your Name (e.g. "Administrator").
3. Enter a unique Room ID (e.g. "Boda2026").
4. Select the "Host" role and click "Connect Now".
5. In the Host Panel, input a question (e.g. "What is the best dessert?").
6. Provide up to 4 options (e.g. "Cake", "Ice Cream", "Fruit").
7. Click "Publish Poll" to broadcast the state to the room.

### Step 2: Join as a Player (Voter)

1. Open a new incognito window, tab, or use a completely different device.
2. Enter your Name (e.g. "Voter 1").
3. Enter the exact same Room ID used by the Host ("Boda2026").
4. Select the "Player" role and click "Connect Now".
5. Upon connecting, the system will instantly push the current active poll to your screen.

### Step 3: Interactive Voting

- Click on any option to cast your vote.
- Notice the animated progress bars update instantly on both the Host's screen and the Player's screen.
- As a Player, you can click "Revote" to retract your current selection and choose a different option. The server will automatically adjust the counts.
- Click "Leave Room" at any time to return to the Connection screen.

---

## Color Palette (Nature Green Theme)

The application enforces strict design guidelines based on the following hex codes:

- Sage: #A3B18A
- Cream: #DAD7CD
- Forest: #588157
- Dark Green: #3A5A40
- Deepest Green: #344E41
