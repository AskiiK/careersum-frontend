// src/App.jsx
import { Routes, Route } from 'react-router-dom'; // Import routing components
import Chat from './Chat'; // We will need the Chat component directly
import './App.css';

// This is the component for the main page
function MainPage() {
  return (
    <div className="main-page-container">
      <h1>CareerSum AI Agent</h1>
      <p>This is the main, standalone page for the chat application.</p>
      <Chat />
    </div>
  );
}

// This is the component for the embedded widget
function WidgetPage() {
  // This version has no extra titles or padding, it's just the chat component.
  return <Chat />;
}

function App() {
  return (
    <Routes>
      {/* Route for the main page */}
      <Route path="/" element={<MainPage />} />
      
      {/* Route for the embedded widget */}
      <Route path="/widget" element={<WidgetPage />} />
    </Routes>
  );
}

export default App;
