import io from "socket.io-client";
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import "bootstrap/dist/css/bootstrap.css";
import "./style.css";
import React from "react";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import moment from "moment";


const username = prompt("what is your username");

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"]
});

const App = ({}) => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("username", username);
    });

    socket.on("users", users => {
      setUsers(users);
    });

    socket.on("message", message => {
      setMessages(messages => [...messages, message]);
    });

    socket.on("connected", user => {
      setUsers(users => [...users, user]);
    });

    socket.on("disconnected", id => {
      setUsers(users => {
        return users.filter(user => user.id !== id);
      });
    });
  }, []);

  const submit = event => {
    event.preventDefault();
    socket.emit("send", message);
    setMessage("");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 mt-4 mb-4">
          <h1>Hello {username}</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <h6>
            <i className="fa fa-quote-left"></i> <i className="fa fa-quote-right"></i> Messages</h6>
        <div id="messages">
          {messages.map(({ user, date, text }, index) => (
            <div key={index} className="row mb-2">
              <div className="col-md-2">- {user.name}</div>
              <div className="col-md-10">{text}</div>             
              <div className="col-md-8">
                {moment(date).format("h:mm a")}
              </div>
              
            </div>
            ))}
          </div>
          <form onSubmit={submit} id="form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Message"
                className="form-control"
                onChange={e => setMessage(e.currentTarget.value)}
                value={message}
                id="text"
              />
              <span className="input-group-btn">
                <button id="submit" type="submit" className="btn btn-primary">
                <i className="fa fa-arrow-circle-up"></i> Submit 
                </button>
              </span>
            </div>
          </form>
        </div>
        <div className="col-md-4">
          <h6><i className="fa fa-users"></i> Users</h6>
          <ul id="users">
            {users.map(({ name, id }) => (
              <ul key={id}><i className="fa fa-caret-right"></i> {name}  </ul>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));