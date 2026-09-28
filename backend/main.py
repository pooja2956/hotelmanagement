from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import create_table, get_db_connection
from backend.models import RoomCreate, RoomUpdate

app = FastAPI(title="Hotel Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_table()

@app.get("/")
def home():
    return {"message": "Hotel Management System API is running"}

@app.post("/rooms")
def add_room(room: RoomCreate):
    conn = get_db_connection()
    conn.execute("""
        INSERT INTO rooms
        (room_number, guest_name, room_type, price, status)
        VALUES (?, ?, ?, ?, ?)
    """, (
        room.room_number,
        room.guest_name,
        room.room_type,
        room.price,
        room.status
    ))
    conn.commit()
    conn.close()
    return {"message": "Room added successfully"}

@app.get("/rooms")
def get_rooms():
    conn = get_db_connection()
    rooms = conn.execute("SELECT * FROM rooms ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(room) for room in rooms]

@app.put("/rooms/{room_id}")
def update_room(room_id: int, room: RoomUpdate):
    conn = get_db_connection()
    cursor = conn.execute("""
        UPDATE rooms
        SET room_number=?, guest_name=?, room_type=?, price=?, status=?
        WHERE id=?
    """, (
        room.room_number,
        room.guest_name,
        room.room_type,
        room.price,
        room.status,
        room_id
    ))
    conn.commit()
    conn.close()

    if cursor.rowcount == 0:
        return {"message": "Room not found"}
    return {"message": "Room updated successfully"}

@app.delete("/rooms/{room_id}")
def delete_room(room_id: int):
    conn = get_db_connection()
    cursor = conn.execute("DELETE FROM rooms WHERE id=?", (room_id,))
    conn.commit()
    conn.close()

    if cursor.rowcount == 0:
        return {"message": "Room not found"}
    return {"message": "Room deleted successfully"}
