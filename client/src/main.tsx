import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add title to the page
document.title = "CryptGen Class Website";

// Add meta description
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "CryptGen Class - A modern class management website";
document.head.appendChild(metaDescription);

// Add favicon link
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎓</text></svg>";
document.head.appendChild(favicon);

// Font awesome
const fontAwesome = document.createElement("link");
fontAwesome.rel = "stylesheet";
fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
document.head.appendChild(fontAwesome);

createRoot(document.getElementById("root")!).render(<App />);
