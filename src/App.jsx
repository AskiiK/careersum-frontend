// src/App.jsx

import Chat from './Chat'; // 1. Import the Chat component

function App() {
  return (
    <div>
      {/* We are removing the old h1 and p tags */}
      <Chat /> {/* 2. Render the Chat component here */}
    </div>
  );
}

export default App;
