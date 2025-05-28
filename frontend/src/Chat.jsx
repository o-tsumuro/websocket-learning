import { useEffect, useRef, useState } from 'react';

function Chat({ roomId }) {
  const [message, setMessage] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
    ws.current = socket;

    socket.onmessage = (event) => {
      setMessage((prev) => [...prev, event.data]);
    };

    socket.onclose = () => {
      console.log('WebSocket切断');
    };

    return () => {
      socket.close();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (input.trim() && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(input);
      setInput('');
    }
  };

  return (
    <div>
      <h3>ルーム: {roomId}</h3>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 200, overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="メッセージを入力"
      />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
}

export default Chat;