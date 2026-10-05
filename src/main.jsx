import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter-tight";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "lenis/dist/lenis.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <App />
);
