import { useState } from 'react';
import Chat from '.Chat';

function App() {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
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
          <h2>ルーム入室</h2>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder='名前を入力'
          />
          <br />
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="ルーム番号"
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
