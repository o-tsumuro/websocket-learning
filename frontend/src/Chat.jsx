import { useEffect, useRef, useState } from 'react';

function Chat({ roomId, userName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
    ws.current = socket;

    socket.onmessage = (event) => {
      const msg = event.data;

      if (msg === "error:room_full") {
        setError('このルームは満員です。他のルームを選んで下さい。');
        socket.close();
        return;
      }

      const msgObj = JSON.parse(msg);
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

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h3>ルーム: {roomId}</h3>
      <div
        style={{
          border: '1px solid #ccc',
          padding: 10,
          height: 200,
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {messages.map((msg, idx) => {
          const isMe = msg.name === userName;
          return (
            <div
              key={idx}
              style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                backgroundColor: isMe ? '#dcf8c6' : '#f1f0f0',
                padding: '8px 12px',
                borderRadius: 10,
                maxWidth: '70%',
              }}
            >
              <strong style={{ fontSize: 12 }}>{msg.name}</strong>
              <div>{msg.message}</div>
            </div>
          );
        })}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="メッセージを入力"
        style={{ width: '80%'}}
      />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
}

export default Chat;