import "bootstrap/dist/css/bootstrap.min.css";
import '../style/Chat.css'
import Card from 'react-bootstrap/Card';
import ScrollToBottom from "react-scroll-to-bottom";

export default function Print_message(props) {

    return (

        <ScrollToBottom className="p_mess">
            {props._messageList.map((msg) =>
                <div className="contain"><div className={sessionStorage.getItem("user_name") === msg.username ? "me" : "other"}>{sessionStorage.getItem("user_name") === msg.username ? "me" + " : " + msg.text : msg.username + " : " + msg.text}</div></div>)}
            {/* <Card bg="info" style={{ width: '18rem' }}>{msg.username + " : " + msg.text}</Card>)}
                <Card bg={sessionStorage.getItem("user_name") === msg.username ? "info" : "light"} style={{ width: '6rem' }}>{msg.username + " : " + msg.text}</Card>)} */}
        </ScrollToBottom>
    );
}
