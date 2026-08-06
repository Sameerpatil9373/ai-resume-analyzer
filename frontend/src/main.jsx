import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App.jsx";
  console.log("Origin:", window.location.origin);
console.log("Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

createRoot(document.getElementById("root")).render(
  
  <StrictMode>
    <GoogleOAuthProvider clientId="122248646537-547vfpds0f2lkl99dk4bi6fkakkjmg5r.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);