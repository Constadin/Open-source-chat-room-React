# Open-Source Chat Room Application

A full-stack, real-time chat room application developed with **React**, **ASP.NET Core**, **C#**, and **SignalR**.

The project was created to demonstrate multi-user communication, real-time message delivery, user authentication, and client-server integration through a modern web architecture.

> **Project type:** Independent Full-Stack Software Project

---

## Demo

A presentation of the application is available on LinkedIn:

[View the project demonstration on LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7205545423158128640/)

---

## Application Preview

![Open-Source Chat Room Application](https://github.com/Constadin/Open-source-chat-room-application/assets/114903866/edaae918-20f2-4e1d-8852-1f623e909e39)

---

## Overview

The application allows multiple users to connect to a shared chat environment and communicate in real time.

It combines:

- A **React** client application
- An **ASP.NET Core Web API**
- A **SignalR Hub**
- WebSocket-based real-time communication
- User login and protected client routes
- Server-side controllers and application models

The project can also be extended to support different communication scenarios, private conversations, multiple rooms, presence tracking, and persistent message storage.

---

## Core Features

- Multi-user real-time communication
- User login
- Protected client-side routes
- SignalR Hub connections
- WebSocket-based message delivery
- ASP.NET Core API controllers
- React Context-based state management
- Separation between frontend and backend projects
- Extensible communication scenarios
- Cross-origin client-server communication

---

## Technologies

### Backend

- **C#**
- **.NET 8**
- **ASP.NET Core Web API**
- **SignalR**
- **WebSockets**
- **Controllers**
- **Dependency Injection**

### Frontend

- **React**
- **JavaScript**
- **JSX**
- **React Context API**
- **CSS**
- **Client-side routing**

---

## Solution Structure

```text
Open-source-chat-room-application/
├── ChatServer.API/
│   ├── Controllers/
│   ├── Hubs/
│   ├── Models/
│   ├── Properties/
│   ├── VirtualData/
│   ├── Program.cs
│   ├── appsettings.json
│   └── ChatServer.API.csproj
│
└── clientschat.ui/
    └── src/
        ├── assets/
        ├── App.css
        ├── App.jsx
        ├── AuthContext.jsx
        ├── CustomContext.jsx
        ├── PrivateRoute.jsx
        ├── index.css
        └── main.jsx
```

---

## Architecture

The application follows a client-server architecture.

```text
React Client
     |
     | HTTP requests
     v
ASP.NET Core Controllers
     |
     | SignalR negotiation
     v
SignalR Hub
     |
     | WebSocket connection
     v
Connected Chat Users
```

### React Client

The frontend is responsible for:

- User interface rendering
- Login interaction
- Client-side state management
- Protected navigation
- Establishing the SignalR connection
- Sending and receiving real-time messages

### ASP.NET Core API

The backend is responsible for:

- HTTP API endpoints
- User-related requests
- SignalR Hub hosting
- Connection management
- Message broadcasting
- Application configuration

### SignalR Hub

The Hub coordinates real-time communication between connected clients.

Typical responsibilities include:

- Accepting client connections
- Sending messages to connected users
- Broadcasting events
- Managing communication groups
- Handling disconnections and reconnections

---

## Getting Started

### Prerequisites

Install:

- [.NET 8 SDK](https://dotnet.microsoft.com/)
- [Node.js](https://nodejs.org/)
- npm
- Visual Studio 2022, Visual Studio Code, or another compatible IDE

---

## Clone the Repository

```bash
git clone https://github.com/Constadin/Open-source-chat-room-application.git
cd Open-source-chat-room-application
```

---

## Run the Backend

Navigate to the backend project:

```bash
cd ChatServer.API
```

Restore dependencies:

```bash
dotnet restore
```

Run the API:

```bash
dotnet run
```

The terminal will display the local HTTP and HTTPS addresses used by the API.

---

## Run the React Client

Open a second terminal and navigate to the React project:

```bash
cd clientschat.ui
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local address displayed by the frontend development server.

---

## SignalR Connection

The React client must connect to the Hub endpoint exposed by the ASP.NET Core application.

Example:

```javascript
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7000/chatHub")
  .withAutomaticReconnect()
  .build();

await connection.start();
```

Replace the URL and Hub route with the values configured in the project.

---

## Example Backend Configuration

The ASP.NET Core application must register SignalR and map the Hub endpoint.

```csharp
builder.Services.AddSignalR();

var app = builder.Build();

app.MapControllers();
app.MapHub<ChatHub>("/chatHub");

app.Run();
```

Cross-origin access may also need to be enabled when the React client and API run on different ports.

---

## Communication Flow

```text
1. The user logs in through the React client.
2. The client establishes a SignalR connection.
3. The server accepts the connection through the Chat Hub.
4. A user sends a message.
5. The Hub broadcasts the message to the intended users.
6. Connected React clients update their interfaces in real time.
```

---

## Potential Extensions

- Multiple chat rooms
- Private one-to-one messaging
- User presence and online status
- Typing indicators
- Message history
- Database persistence
- JWT authentication
- File and image sharing
- Read receipts
- Push notifications
- Moderation tools
- Automated tests
- Docker support
- CI/CD workflows

---

## Repository Cleanup Recommendations

The following generated or user-specific files should normally not be committed:

```text
bin/
obj/
*.csproj.user
```

Add them to `.gitignore` to keep the repository clean and portable.

Sensitive values such as passwords, tokens, connection strings, and private URLs should not be stored directly in:

```text
appsettings.json
signalRconnections.json
```

Use development secrets or environment variables instead.

---

## Project Status

This is an independent, open-source, full-stack software project created for learning, experimentation, portfolio presentation, and the development of real-time communication scenarios.

---

## Author

**Nikolas Konstantinidis**

Full-Stack .NET Developer

- [GitHub](https://github.com/Constadin)
- [LinkedIn](https://www.linkedin.com/in/nikos-konstantinidis-developer/)

---

## License

Add or review the repository's license file before distributing or reusing the project.

If no license is included, the source code remains protected by default copyright terms.
