import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';

const Login = ({ socket }) => {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const navigation = useNavigate();

    const getConnection = async (e) => {
        sessionStorage.setItem("user_name", username);
        socket.emit("connection", username)
        // sessionStorage.setItem("room", room);
        // socket.emit("join_room", room)
        // console.log(socket.id + " " + room)
        navigation("/chat", { replace: true });
        // window.location.reload(false);
    }

    return (
        <div className="input_">
            <input
                type="text"
                value={username}
                placeholder="Enter Username"
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(event) => {
                    event.key === "Enter" && getConnection();
                }}
            />
            <button onClick={getConnection}>LOGIN</button>
        </div>
    )
}

export default Login;