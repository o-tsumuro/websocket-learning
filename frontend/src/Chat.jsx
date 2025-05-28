import { useEffect, useRef, useState } from 'react';

function Chat({ roomId, userName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
    ws.current = socket;

    socket.onmessage = (event) => {
      const msgObj = JSON.parse(event.data);
      setMessages((prev) => [...prev, msgObj]);
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
      const msgObj = {
        name: userName,
        message: input,
      };
      ws.current.send(JSON.stringify(msgObj));
      setInput('');
    }
  };

  return (
    <div>
      <h3>ルーム: {roomId}</h3>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 200, overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.name}:</strong> {msg.message}
          </div>
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