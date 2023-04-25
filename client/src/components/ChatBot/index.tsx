import React, { useEffect, useState } from "react";
import "react-chat-widget/lib/styles.css";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";
import { Widget, addResponseMessage, toggleMsgLoader} from "react-chat-widget";
// import clearIcon from "./assets/trash-2.svg";
import Popup from "../footer.popup";
import { setUpSocketClient } from "../../config/socket";
import "./Chat.css";
import "./feedback.css"
import DislikeExt from "./dislikeExtention";
import LikeExt from "./likeExtention";

const ChatBot = () => {
  
  const pull_data = (data:[]) => {
    console.log(data); // LOGS DATA FROM CHILD (My name is Dean Winchester... &)
  }

  const [toggleDisLike, setToggleDislike] = useState(false);
  const [toggleLike,setToggleLike] = useState (false);
  const [showPopup, setShowPopup] = useState(false);
  const [messageId,setMessageId] = useState("");
  const [btn,setBtn] = useState<HTMLDivElement[]>([]);

  const [client] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>(
    setUpSocketClient()
  );
  const toggleTyping = () => {
    toggleMsgLoader();
  };
  const ChatFeed = React.memo(() => {
    const handleNewUserMessage = (e: string) => {
      toggleTyping();
      client.emit("textMessage", e);
    };
    return (
      <Widget
        handleNewUserMessage={handleNewUserMessage} //
        title=""
        subtitle=""
        senderPlaceHolder="მომწერე რაც გინდა"
        showCloseButton={true}
      />
    );
  });
  const handleClear = () => {
    window.location.reload();
  };
  const handleLikeClose = () => {
    sender ({like :1,contextField :0, contentField :0, convertField :0,message_id: messageId,optional_feedback: ""});
    setToggleLike(false);
    document.getElementById("temp")?.classList.remove("temporary");
  }
  const handleDislikeClose = () => {
    sender ({like :0,contextField :0, contentField :0, convertField :0,message_id: messageId,optional_feedback: ""});
    setToggleDislike(false);
    document.getElementById("temp")?.classList.remove("temporary");
  }
  const handleLike = (e: any) => {
    if (e.target.style.backgroundColor === "green" && e.target.parentElement.children[1].style.backgroundColor !== "red") {
      client.emit("feedback_remove",{message_id: e.target.id});
      e.target.style.backgroundColor = "transparent";
      e.target.parentElement.children[1].style.backgroundColor = "transparent";
    } else {
      e.target.parentElement.children[1].style.backgroundColor = "transparent";
      e.target.style.backgroundColor = "green";
      setToggleLike(true);
      document.getElementById("temp")?.classList.add("temporary");
      setMessageId(e.target.id);
    }
  };
  const handleDislike = (e: any) => {
    if (e.target.style.backgroundColor !== "green" && e.target.parentElement.children[1].style.backgroundColor === "red") {
      client.emit("feedback_remove",{message_id: e.target.id});
      e.target.style.backgroundColor = "transparent";
      e.target.parentElement.children[0].style.backgroundColor = "transparent";
    }
    else {
      e.target.parentElement.children[0].style.backgroundColor = "transparent";
      e.target.style.backgroundColor = "red";
      setToggleDislike(true);
      document.getElementById("temp")?.classList.add("temporary");
      setMessageId(e.target.id);
    }
  };
  const sender = (data: any) => {
      client.emit("feedback",data);
      setToggleDislike(false);
      setToggleLike(false);
      document.getElementById("temp")?.classList.remove("temporary");
  }
  useEffect (() => {
    let elements = document.getElementsByClassName("rcw-response");
    for (let i =0 ; i < btn.length; i++){
      elements[i].appendChild(btn[i]);
    }
  });
  useEffect(() => {
    let launcher = document.getElementsByClassName("rcw-launcher")[0];

    launcher.dispatchEvent(
      new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
      })
    );
    /*
     * set up listeners for socket connection
     */
    client.on("data",(data: {message: string; message_id: string }) => {
      toggleTyping();

      addResponseMessage(data.message);

      let elements = document.getElementsByClassName("rcw-response");


      let likeBtn = document.createElement("img");

      likeBtn.src = "/img/thumbs-up(1).svg";
      likeBtn.alt = "like";
      likeBtn.className = "likeBtn";
      likeBtn.id = data.message_id;
      likeBtn.addEventListener("click", handleLike);

      let dislikeBtn = document.createElement("img");
      dislikeBtn.src = "/img/thumbs-down.svg";
      dislikeBtn.alt = "dislike";
      dislikeBtn.className = "dislikeBtn";
      dislikeBtn.id = data.message_id;
      dislikeBtn.addEventListener("click", handleDislike);

      const feedback = document.createElement("div");
      feedback.className = "feedback";
      feedback.appendChild(likeBtn);
      feedback.appendChild(dislikeBtn);
      setBtn(oldArray => [...oldArray, feedback]);
      elements[elements.length - 1].appendChild(feedback);

    });
    client.emit("join", "demo-bot");

    return () => {
      client.disconnect();
    };
  }, [client]);

  return (
    <div>
      {toggleDisLike && (
        <div id = "dislikeExt">
          <p id = "closeButton"  onClick={handleDislikeClose} >X</p>
          <DislikeExt func = {sender} id  = {messageId}/>
        </div>
      )}
      {toggleLike && (
        <div id = "likeExt">
        <p id = "closeButton"  onClick={handleLikeClose} >X</p>
        <LikeExt func = {sender} id  = {messageId}/>
      </div>
      )}
      <div
        id="main"
        className="overflow-hidden w-full flex flex-col justify-between bg-bg-main"
        style={{ height: "100dvh", maxHeight: "100dvh" }}
      >
        <div id = "temp"></div>
        <header
          className="flex flex-row justify-between items-center w-full shrink-0"
          style={{ padding: "1.25rem 5%" }}
        >
          <a
            href="https://supernova-ge.github.io/Jipitauri/"
            className="text-white-100 text-sm cursor-pointer text-center"
            target="_blank"
            rel="noreferrer"
          >
            ჩვენ <br /> შესახებ
          </a>
          <h1 className="text-xl font-bold text-white-200">ჟიპიტაური</h1>
          <span
            className="text-white-100 text-sm cursor-pointer text-center"
            onClick={handleClear}
          >
            ახლიდან <br /> დაწყება
          </span>
        </header>
        <main className="overflow-y-auto overflow-x-hidden h-full z-0">
          <ChatFeed />
        </main>
        <footer className="text-white-100 text-xs text-center px-5 py-5 lg:px-20 shrink-0 flex flex-col items-center justify-between">
          <div className="flex flex-row items-center">
            <button className="text-2xl px-5" onClick={() => setShowPopup(true)}>
              ^
            </button>
            <p className="text-start">
              ეს არის ავტომატიზირებული სისტემა რომელიც იყენებს open ai-ს მიერ
              შექმნილ ენობრივ მოდელს, რომელმაც შეიძლება დააგენერიროს ისეთი ტექსტი,
              რომელიც არ ეფუძნება ფაქტებს და არ წარმოადგენს სიმართლეს. ჩვენ არ
              ვიღებთ პასუხისმგებლობას ამ ინფორმაციის სრულყოფილებასა და სისწორეზე.
            </p>
          </div>
          <p className="mt-5">©სუპერნოვა</p>
        </footer>
        <Popup showPopup={showPopup} setShowPopup={setShowPopup} />
      </div>
    </div>
  );
};

export default ChatBot;
