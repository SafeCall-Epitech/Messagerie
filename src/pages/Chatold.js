import React, { useState, useEffect } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";
import '../style/Chat.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Print_message from '../component/Print_message';


function Chat({ socket }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [friend, setFriend] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [_room, setRoom] = useState("");

    const join_friend = async () => {
        var items = [sessionStorage.getItem("user_name"), friend];
        items.sort((a, b) => a.localeCompare(b, 'fr', { ignorePunctuation: true }));
        setRoom(items[0] + "_" + items[1])
    }
    const sendMessage = async () => {
        console.log(socket.id)
        console.log(_room)
        if (currentMessage !== "") {
            const msg = {
                username: sessionStorage.getItem("user_name"),
                text: currentMessage,
                room: _room
            };

            await socket.emit('s_mess', msg);
            setCurrentMessage("");
        }
    }
    socket.on("r_mess", function (data) {
        if (data !== []) {
            if (messageList.length !== 0) {
                setMessageList([...messageList, data])
            } else {
                setMessageList([data])
            }
        }
    });

    socket.on("get_list_user", function (data) {
        console.log("coucou" + data)
    })

    socket.emit("join_room", _room)

    return (
        <div className='part'>
            <div className='left_part'>
                <div className="input_">
                    <input
                        type="text"
                        value={friend}
                        placeholder="Select a friend"
                        onChange={(event) => {
                            setFriend(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && join_friend();
                        }}
                    />
                    <button onClick={join_friend}>JOIN</button>
                </div>
                <div></div>
            </div>
            <div className='middle_part'>
                <div className="Chat">
                    <Print_message _messageList={messageList} />
                </div>
                <div className="input_">
                    <input
                        type="text"
                        value={currentMessage}
                        placeholder="Entrer votre message"
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    />
                    <button onClick={sendMessage}>SEND</button>
                </div>
            </div>
        </div>

    );
}

export default Chat;