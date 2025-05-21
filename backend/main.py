from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS (Reactと接続するために許可)
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# ルームごとの接続管理
class ConnectionManager:
  def __init__(self):
    self.active_connections: dict[str, list[WebSocket]] = {}

  async def connect(self, room: str, websocket: WebSocket):
    await websocket.accept()
    if room not in self.active_connections:
      self.active_connections[room] = []
    self.active_connections[room].append(websocket)

  def disconnect(self, room: str, websocket: WebSocket):
    self.active_connections[room].remove(websocket)
    if not self.active_connections[room]:
      del self.active_connections[room]

  async def broadcast(self, room: str, message: str):
    for connection in self.active_connections.get(room, []):
      await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
  await manager.connect(room_id, websocket)
  try:
    while True:
      data = await websocket.receive_text()
      await manager.broadcast(room_id, data)
  except WebSocketDisconnect:
    manager.disconnect(room_id, websocket)