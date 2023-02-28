import React, { useEffect, useState } from "react";
import "react-chat-widget/lib/styles.css";
import "./App.css";
import { setUpSocketClient } from "./config/socket";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";
import { Widget, addResponseMessage, toggleMsgLoader } from "react-chat-widget";
// import clearIcon from "./assets/trash-2.svg";
import likeIcon from "./assets/thumbs-up(1).svg";
import dislikeIcon from "./assets/thumbs-down.svg";

function App() {
  const [client, setClient] = useState<
    Socket<DefaultEventsMap, DefaultEventsMap>
  >(setUpSocketClient());

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
        handleNewUserMessage={handleNewUserMessage}
        title="ჟიპიტაური"
        subtitle=""
        senderPlaceHolder="მომწერე რაც გინდა"
        showCloseButton={true}
        // style={{ height: window.innerHeight }}
      />
    );
  });

  const handleClear = () => {
    window.location.reload();
  };

  const handleLike = (e: any) => {
    client.on("feedback_received", (data) => {
      e.target.style.backgroundColor = "green";
    });
    client.emit("feedback", {
      value: "like",
      message: e.target.parentElement.innerText,
    });
  };

  const handleDislike = (e: any) => {
    client.on("feedback_received", (data) => {
      e.target.style.backgroundColor = "red";
    });
    client.emit("feedback", {
      value: "dislike",
      message: e.target.parentElement.parentElement.innerText,
    });
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
      likeBtn.src = likeIcon;
      likeBtn.alt = "like";
      likeBtn.className = "likeBtn";
      likeBtn.addEventListener("click", handleLike);

      let dislikeBtn = document.createElement("img");
      dislikeBtn.src = dislikeIcon;
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
    <div id="main" style={{ height: window.innerHeight, display: "none" }}>
      <span>
        <a
          href="https://supernova-pulsaraigeorgia.github.io/Jipitauri/"
          className="aboutUs"
          target="_blank"
          rel="noreferrer"
        >
          ჩვენ შესახებ
        </a>
      </span>
      <ChatFeed />
      {/* <img src={clearIcon} alt="clear" className="clearIcon"></img> */}
      <span className="clearIcon" onClick={handleClear}>
        ახლიდან დაწყება
      </span>
    </div>
  );
}

export default App;
