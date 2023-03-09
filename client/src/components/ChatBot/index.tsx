import React, { useEffect, useRef, useState } from "react";
import "react-chat-widget/lib/styles.css";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";
import { Widget, addResponseMessage, toggleMsgLoader } from "react-chat-widget";
// import clearIcon from "./assets/trash-2.svg";
import Popup from "../footer.popup";
import { setUpSocketClient } from "../../config/socket";
import "./Chat.css";

const ChatBot = () => {
  const [client, setClient] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>(setUpSocketClient());

  const [showPopup, setShowPopup] = useState(false);

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

  const handleLike = (e: any) => {
    if (e.target.style.backgroundColor === "green") {
      e.target.style.backgroundColor = "transparent";
    } else {
      client.on("feedback_received", (data) => {
        e.target.style.backgroundColor = "green";
        e.target.parentElement.children[1].style.backgroundColor = "transparent";
      });
      client.emit("feedback", {
        value: "like",
        message: e.target.parentElement.parentElement.innerText,
      });
    }
  };

  const handleDislike = (e: any) => {
    if (e.target.style.backgroundColor === "red") {
      e.target.style.backgroundColor = "transparent";
    } else {
      client.on("feedback_received", (data) => {
        e.target.style.backgroundColor = "red";
        e.target.parentElement.children[0].style.backgroundColor = "transparent";
      });
      client.emit("feedback", {
        value: "dislike",
        message: e.target.parentElement.parentElement.innerText,
      });
    }
  };

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
    client.on("data", (data) => {
      toggleTyping();

      addResponseMessage(data.message);

      let elements = document.getElementsByClassName("rcw-response");

      let likeBtn = document.createElement("img");
      likeBtn.src = "/img/thumbs-up(1).svg";
      likeBtn.alt = "like";
      likeBtn.className = "likeBtn";
      likeBtn.addEventListener("click", handleLike);

      let dislikeBtn = document.createElement("img");
      dislikeBtn.src = "/img/thumbs-down.svg";
      dislikeBtn.alt = "dislike";
      dislikeBtn.className = "dislikeBtn";
      dislikeBtn.addEventListener("click", handleDislike);

      const feedback = document.createElement("div");
      feedback.className = "feedback";
      feedback.appendChild(likeBtn);
      feedback.appendChild(dislikeBtn);

      elements[elements.length - 1].appendChild(feedback);
    });
    client.emit("join", "demo-bot");

    return () => {
      client.disconnect();
    };
  }, [client]);

  return (
    <div id="main" className="overflow-hidden w-full flex flex-col justify-between bg-bg-main" style={{ height: "100dvh", maxHeight: "100dvh" }}>
      <header className="flex flex-row justify-between items-center w-full shrink-0" style={{ padding: "1.25rem 5%" }}>
        <a href="https://supernova-ge.github.io/Jipitauri/" className="text-white-100 text-sm cursor-pointer text-center" target="_blank" rel="noreferrer">
          ჩვენ <br /> შესახებ
        </a>
        <h1 className="text-xl font-bold text-white-200">ჟიპიტაური</h1>
        <span className="text-white-100 text-sm cursor-pointer text-center" onClick={handleClear}>
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
          <p className="text-start">ეს არის ავტომატიზირებული სისტემა რომელიც იყენებს open ai-ს მიერ შექმნილ ენობრივ მოდელს, რომელმაც შეიძლება დააგენერიროს ისეთი ტექსტი, რომელიც არ ეფუძნება ფაქტებს და არ წარმოადგენს სიმართლეს. ჩვენ არ ვიღებთ პასუხისმგებლობას ამ ინფორმაციის სრულყოფილებასა და სისწორეზე.</p>
        </div>
        <p className="mt-5">©სუპერნოვა</p>
      </footer>
      <Popup showPopup={showPopup} setShowPopup={setShowPopup} />
    </div>
  );
};

export default ChatBot;
