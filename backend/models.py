from pydantic import BaseModel

class RoomCreate(BaseModel):
    room_number: str
    guest_name: str
    room_type: str
    price: float
    status: str

class RoomUpdate(BaseModel):
    room_number: str
    guest_name: str
    room_type: str
    price: float
    status: str
