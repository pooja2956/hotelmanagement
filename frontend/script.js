const API_URL = "http://127.0.0.1:8000";

const roomForm = document.getElementById("roomForm");
const roomList = document.getElementById("roomList");
const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

let editingRoomId = null;

roomForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const room = {
        room_number: document.getElementById("room_number").value.trim(),
        guest_name: document.getElementById("guest_name").value.trim(),
        room_type: document.getElementById("room_type").value.trim(),
        price: parseFloat(document.getElementById("price").value),
        status: document.getElementById("status").value
    };

    if (!room.room_number || !room.guest_name || !room.room_type || !room.status || isNaN(room.price) || room.price < 0) {
        alert("Please enter all fields correctly.");
        return;
    }

    const url = editingRoomId
        ? `${API_URL}/rooms/${editingRoomId}`
        : `${API_URL}/rooms`;

    const method = editingRoomId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(room)
        });

        const data = await response.json();
        alert(data.message);

        roomForm.reset();
        editingRoomId = null;
        formTitle.textContent = "Add Room";
        submitButton.textContent = "Add Room";
        cancelButton.hidden = true;

        loadRooms();
    } catch (error) {
        alert("Error connecting to server.");
    }
});

async function loadRooms() {
    try {
        const response = await fetch(`${API_URL}/rooms`);
        const rooms = await response.json();

        roomList.innerHTML = "";

        rooms.forEach(room => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${room.id}</td>
                <td>${room.room_number}</td>
                <td>${room.guest_name}</td>
                <td>${room.room_type}</td>
                <td>${room.price}</td>
                <td>${room.status}</td>
                <td>
                    <button class="action" onclick="editRoom(${room.id}, '${escapeValue(room.room_number)}', '${escapeValue(room.guest_name)}', '${escapeValue(room.room_type)}', ${room.price}, '${escapeValue(room.status)}')">Edit</button>
                    <button class="action" onclick="deleteRoom(${room.id})">Delete</button>
                </td>
            `;

            roomList.appendChild(row);
        });
    } catch (error) {
        console.log("Error loading rooms");
    }
}

function escapeValue(value) {
    return String(value).replace(/'/g, "\'");
}

function editRoom(id, roomNumber, guestName, roomType, price, status) {
    editingRoomId = id;

    document.getElementById("room_number").value = roomNumber;
    document.getElementById("guest_name").value = guestName;
    document.getElementById("room_type").value = roomType;
    document.getElementById("price").value = price;
    document.getElementById("status").value = status;

    formTitle.textContent = "Update Room";
    submitButton.textContent = "Update Room";
    cancelButton.hidden = false;
}

async function deleteRoom(id) {
    if (!confirm("Are you sure you want to delete this room?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/rooms/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();
        alert(data.message);
        loadRooms();
    } catch (error) {
        alert("Error connecting to server.");
    }
}

cancelButton.addEventListener("click", function () {
    roomForm.reset();
    editingRoomId = null;
    formTitle.textContent = "Add Room";
    submitButton.textContent = "Add Room";
    cancelButton.hidden = true;
});

loadRooms();
