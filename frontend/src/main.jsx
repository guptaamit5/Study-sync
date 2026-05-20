import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; 
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );


<GoogleOAuthProvider clientId="173868920350-2aqkqgh7mnv5a7rn2doso3hnhn5li2co.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>
);