import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("main.tsx: Starting React application initialization.");

// Ensure light theme is always applied for the extension
document.documentElement.classList.remove('dark');

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("main.tsx: Root element found, rendering App component.");
  createRoot(rootElement).render(<App />);
} else {
  console.error("main.tsx: Root element not found!");
}
console.log("main.tsx: Finished React application initialization.");
