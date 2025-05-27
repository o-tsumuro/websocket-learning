import { useState } from 'react';
import Chat from '.Chat';

function App() {
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (roomId.trim()) {
      setJoined(true);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {!joined ? (
        <div>
          <h2>ルーム番号を入力して下さい</h2>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="例: 1234"
          />
          <button onClick={handleJoin}>入室</button>
        </div>
      ) : (
        <Chat roomId={roomId} />
      )}
    </div>
  );
}

export default App
