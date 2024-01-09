import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

root.render(<App />);