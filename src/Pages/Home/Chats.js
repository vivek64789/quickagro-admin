import React, { useEffect, useRef, useState } from "react";
import { serverUrl } from "../../Utils/server";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import { toast, ToastContainer, darkToast } from "../../Components/Toast";
import storage from "../../Firebase/config";

var socket = require("socket.io-client")(serverUrl);

function Chats() {
  const scrollRef = useRef(null);
  const imageUploadRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatModal, setNewChatModal] = useState(false);
  const [users, setUsers] = useState([]);

  const [currentChatId, setCurrentChatId] = useState("");
  const [message, setMessage] = useState("");

  const [sendingChat, setSendingChat] = useState(false);

  useEffect(() => {
    getChats();
    getUsers();
  }, []);

  const getChats = () => {
    setLoading(true);

    const config = {
      method: "get",
      url: `${serverUrl}/chats/get-chats`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config)
      .then((response) => {
        setChats(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const createChat = (clientId) => {
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/chats/new-chat`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        clientId: clientId,
      },
    };

    axios(config)
      .then((response) => {
        getChats();
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === "Request failed with status code 500") {
          toast("Chat already exist", darkToast);
        } else {
          toast("Something went wrong", darkToast);
        }
        setLoading(false);
      });
  };

  const getChatMessages = (chatId) => {
    setLoading(true);

    const config = {
      method: "get",
      url: `${serverUrl}/chats/get-messages/${chatId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config)
      .then((response) => {
        setLoading(false);
        setChatMessages(response.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getUsers = () => {
    setLoading(true);

    const config = {
      method: "get",
      url: `${serverUrl}/users/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    socket.on("message", (message) => {
      if (message.chatId === currentChatId) {
        setChatMessages([...chatMessages, message]);
      }
    });
  }, [currentChatId, chatMessages]);

  const sendImageChat = (image) => {
    setSendingChat(true);
    const fileName = `${currentChatId + "_imageChat_" + Date.now().toString()}`;

    const upload = storage.ref(`uploads/${fileName}`).put(image);
    upload.on(
      "state_changed",
      (snapshot) => () => {},
      (error) => {},
      () => {
        storage
          .ref("uploads")
          .child(`${fileName}`)
          .getDownloadURL()
          .then((url) => {
            socket.emit("message", {
              chatId: currentChatId,
              message: url,
              senderIsAdmin: true,
              isImage: true,
            });
            setSendingChat(false);
          });
      }
    );
  };

  return (
    <>
      <Modal
        isOpen={newChatModal}
        onRequestClose={() => setNewChatModal(false)}
        style={{
          content: {
            borderRadius: "1rem",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.7)",
          },
        }}
      >
        <div className="modalContent">
          <p className="modalTitle">New Chat</p>
          <div className="modal-body-scrollable">
            {users.map((user) => {
              return user.type !== "client" ? (
                ""
              ) : (
                <div
                  className="chat-list-tile"
                  onClick={() => {
                    createChat(user._id);
                    setNewChatModal(false);
                  }}
                >
                  <div className="profile-circle">
                    <img src={user.profilePic} alt="" />
                  </div>
                  <div className="text">
                    <p>{user.name}</p>
                    <p>
                      {user.type[0].toUpperCase() +
                        user.type.toString().substring(1, user.type.length)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
      <div className="content-body">
        <div className="content-title">
          <p>Chats</p>
          <button
            onClick={() => {
              setNewChatModal(true);
            }}
          >
            + New Chat
          </button>
        </div>
        {loading ? (
          <ReactLoading
            type={"spinningBubbles"}
            color={"var(--primaryColor)"}
            width={"4rem"}
            height={"4rem"}
          />
        ) : (
          <div className="chat-main">
            <div className="chat-list">
              {chats.length === 0 ? (
                <p style={{ marginTop: "1rem" }}>No Chats</p>
              ) : (
                chats.map((chat) => {
                  return (
                    <div
                      className={`chat-list-tile ${
                        currentChatId === chat._id ? "selected-chat" : ""
                      }`}
                      onClick={() => {
                        setCurrentChatId(chat._id);
                        getChatMessages(chat._id);
                      }}
                    >
                      <div className="profile-circle">
                        <img src={chat.clientProfilePic} alt="" />
                      </div>
                      <div className="text">
                        <p>{chat.clientName}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="chat-messages">
              {currentChatId === "" ? (
                <div
                  className="chat-hint"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome
                    name="comments"
                    style={{
                      fontSize: "5rem",
                      color: "var(--primaryColor)",
                      marginBottom: "1rem",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "500",
                      color: "var(--primaryColor)",
                    }}
                  >
                    {chats.length === 0
                      ? "Click + New Chat to get started"
                      : "Select a chat to start messaging"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="messages">
                    {chatMessages.map((message) => {
                      return (
                        <div
                          className="message-row"
                          style={{
                            justifyContent: message.senderIsAdmin
                              ? "end"
                              : "start",
                          }}
                        >
                          <p
                            style={{
                              color: message.senderIsAdmin
                                ? "var(--primaryColor)"
                                : "black",
                              backgroundColor: message.senderIsAdmin
                                ? "var(--primaryLight)"
                                : "rgba(0,0,0,0.06)",
                            }}
                          >
                            {message.isImage ? (
                              <img
                                style={{ maxWidth: "250px" }}
                                src={message.message}
                                alt="imageChat"
                              />
                            ) : (
                              message.message
                            )}
                          </p>
                        </div>
                      );
                    })}
                    <div ref={scrollRef} />
                  </div>
                  {sendingChat ? (
                    <div className="row" style={{ justifyContent: "end" }}>
                      <ReactLoading
                        type={"spinningBubbles"}
                        color={"var(--primaryColor)"}
                        width={"4rem"}
                        height={"4rem"}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="chat-box" style={{ paddingLeft: "1rem" }}>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={imageUploadRef}
                      onChange={(e) => {
                        sendImageChat(e.target.files[0]);
                        // toast("Can't send image in Demo", darkToast);
                      }}
                    />
                    <button
                      onClick={() => {
                        imageUploadRef.current.click();
                      }}
                    >
                      <FontAwesome name="photo" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type something here.."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          if (!message) return;
                          socket.emit("message", {
                            chatId: currentChatId,
                            message: message,
                            senderIsAdmin: true,
                            isImage: false,
                          });
                          setMessage("");
                        }
                        // toast("Can't send message in Demo", darkToast);
                      }}
                    />
                    <button
                      onClick={() => {
                        if (!message) return;
                        socket.emit("message", {
                          chatId: currentChatId,
                          message: message,
                          senderIsAdmin: true,
                          isImage: false,
                        });
                        setMessage("");
                        // toast("Can't send message in Demo", darkToast);
                      }}
                    >
                      <FontAwesome name="send" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
}

export default Chats;
