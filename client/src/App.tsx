import Login from "./components/Login";
import { gapi } from "gapi-script";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/Route/protectedRoute";
import ChatBot from "./components/ChatBot";
import { useState } from "react";

function App() {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: "752019399960-kv19erb24bcjegpnjtmclbq895bc960n.apps.googleusercontent.com",
      plugin_name: "chat",
    });
  });

  return (
    <Routes>
      <Route index element={<Login />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatBot />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
