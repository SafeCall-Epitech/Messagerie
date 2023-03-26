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
        <div className="menu">
            <header>
                <h1 className="title">First Chat</h1>
            </header >
            <form onSubmit={getConnection} >
                <div className='login'>
                    <h2>LOGIN</h2>
                    <label htmlFor='username'>Username</label>
                    <input
                        name='username'
                        type='text'
                        value={username}
                        placeholder='Enter your username'
                        onChange={(e) => setUsername(e.target.value)} />
                    {/* <input
                            name='room'
                            type='text'
                            value={room}
                            placeholder='Enter the channel'
                            onChange={(e) => setRoom(e.target.value)} /> */}
                    <button type="submit">LOGIN</button>
                </div>
            </form >
        </div >
    )
}

export default Login;