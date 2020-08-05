import React from 'react'
import { Button, Collapse, Modal, InputGroup, FormControl } from 'react-bootstrap';
import "./chatStyle.css"
import io from "socket.io-client";
const connOpt = {
	transports: ["websocket"],
};
let socket = io("https://striveschool.herokuapp.com/", connOpt);



export default function Chat() {
	const [username, setUsername] = React.useState(null);
	const [message, setMessage] = React.useState("");
	const [messages, setMessages] = React.useState([]);
	const [showModal, setShowModal] = React.useState(true);
	const [recipient, setRecipient] = React.useState("");
	const [list, setList] = React.useState([]);
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		console.log(messages);
		socket.on("chatmessage", (msg) => setMessages((messages) => messages.concat({
            from: msg.from,
            text: msg.msg,
		  })));
		  socket.on("bmsg", (msg) => setMessages((messages) => messages.concat({
			from: msg.from,
			text: msg.message,
		  })));
		  socket.on("list", (list) => setList({
			list:list,
		  }),setRecipient({			
			recipient: list[0]
		  }));
		 
		  

}, [socket]);



const handleMessage = (e) => {
		setMessage(e.currentTarget.value);
};

const sendMessage = (e) => {
		e.preventDefault();

		console.log(message);
		if (message !== "") {
			if (recipient !== ""){
				socket.emit("chatmessage", {
					text: message,
					to: recipient,
				});
				setMessage({
					messages: messages.concat({
					  from: username,
					  text: message,
					})
		})
		}else {
			socket.emit("bmsg", {
			user: username,
			message: message,
			});

			setMessage({
				message: "",
			});
		}

		}
};

const sendUser = () => {
    socket.emit("setUsername", {
      username: username,
    });

    fetch(
      "https://striveschool-test.herokuapp.com/api/messages/" +
        username
    )
      .then((resp) => resp.json())
      .then((data) => {
        {
        
          setMessages((messages) => messages.concat(data));
        }
      });

    toggleModal();
  };



const toggleModal = () => {
		if (username !== null) setShowModal(!showModal);
};
const toggleChat = () => {
	setOpen(!open);
};
	return (
		<>
			<div className="container">
				<div className = "row pt-3">
						<div className = "chat-main">
						<div className="col-md-12 chat-header rounded-top text-white">
						<div className="row" aria-controls="example-collapse-text"
						 
						>
								<div className="col-md-6 username pl-2">
										<i className="fa fa-circle text-success" aria-hidden="true"></i>
										<Button
										onClick={() => toggleChat()}
										aria-controls="example-collapse-text"
										aria-expanded={open}
										className="bg-transparent btnFocus border-0"
										>
										<h6 className="m-0"> User </h6>
										</Button>										
								</div>
								<div className="col-md-6 options text-right pr-2">
										<i className="fa fa-plus mr-2" aria-hidden="true"></i>
										<i className="fa fa-video-camera" aria-hidden="true"></i>
										<i className="fa fa-circle text-success live-video mr-1" aria-hidden="true"></i>
										<i className="fa fa-phone mr-2" aria-hidden="true"></i>
										<i className="fa fa-cog mr-2" aria-hidden="true"></i>
										<i className="fa fa-times hide-chat-box" aria-hidden="true"></i>
								</div>
						</div>
				</div>
				<Collapse in={open}>
				<div className="chat-content" id="example-collapse-text" >
					<div className= "col-md-12 chats border">
						<ul className="p-0">
						<ul id="messages">
            {messages.map((msg, i) => (													
              <li key={i}>
																<div class="receive-msg">
                <p className="pl-2 pr-2 rounded" > {msg.from}</p>
				<p>{msg.text}</p>
																</div>
              </li>
            ))}
          </ul>

							{/* <li className="pl-2 pr-2 rounded text-white text-center send-msg mb-1">
							hiii
							</li>
							<li>
							<div class="receive-msg">
							<div class="receive-msg-desc  text-center mt-1 ml-1 pl-2 pr-2">
         <p class="pl-2 pr-2 rounded">hello</p>
        </div>
							</div>

							</li> */}
						</ul>
					</div>
				</div>
				</Collapse>



				<form onSubmit={sendMessage} className="col-md-12 message-box border pl-2 pr-2 border-top-0">
				<input autoComplete="off"
           value={message}
           onChange={handleMessage} type="text" className="pl-0 pr-0 w-100" placeholder="Type a message..." />
						{/* <button>Send</button> */}
						</form>
						<div className="tools">
								<i className="fa fa-picture-o" aria-hidden="true"></i>
								<i className="fa fa-telegram" aria-hidden="true"></i>
								<i className="fa fa-bell" aria-hidden="true"></i>
								<i className="fa fa-meh-o" aria-hidden="true"></i>
								<i className="fa fa-paperclip" aria-hidden="true"></i>
								<i className="fa fa-gamepad" aria-hidden="true"></i>
								<i className="fa fa-camera" aria-hidden="true"></i>
								<i className="fa fa-folder" aria-hidden="true"></i>
								<i className="fa fa-thumbs-o-up m-0" aria-hidden="true"></i>
						</div>
				
						</div>
				</div>
				<Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={showModal}
          onHide={toggleModal}
        >
          <Modal.Header>
            <Modal.Title>Set username</Modal.Title>
            <Modal.Body>
              <InputGroup className="mb-3">
                <FormControl
                  onChange={(e) =>
				setUsername({ username: e.currentTarget.value })
                  }
                ></FormControl>
              </InputGroup>
            </Modal.Body>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={sendUser}>Submit</Button>
          </Modal.Footer>
        </Modal>
		</div>
		</>
	)
}



