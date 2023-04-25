import React, { useEffect, useState } from "react";
import "react-chat-widget/lib/styles.css";

const  DislikeExt = ( props : {func: Function, id:string}) => {
    const [context,setContext] = useState(0);
    const [content,setContent] = useState(0);
    const [convert,setConvert] = useState(0);

    const [optional,setOptional] = useState<string>("");
    
    // for options
    const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      switch (event.target.id) {
        case "translation": 
          setConvert(convert^1);
          break;
        case "topic":
          setContext(context^1);
          break;
        case "wrongAnswer":
          setContent(content^1);
          break;
        default:
          break;
      }
    };
    // for other response
    const textHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setOptional(event.target.value);
    };
    const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!(content === 0 && convert === 0 && context === 0 &&  optional === "")) {
            props.func({like : 0,contextField : context, contentField : content , convertField :convert ,message_id: props.id,optional_feedback: optional});
        }
    };
    return (
        <div className="container">
          <fieldset>
            <legend>გთხოვთ აირჩიოთ მიზეზი</legend>
            <p>
              <textarea placeholder = "რა იყო პრობლემა პასუხთან დაკავშირებით? როგორ შეგვიძლია გამოვასწოროთ იგი?"
                id="other"
                value={optional}
                onChange={textHandler}
              />
              <label htmlFor="other"></label>
            </p>
            <p>
              <input
                type="checkbox"
                id="topic"
                onChange={checkboxHandler}
              />
              <label htmlFor="topic">კონტექსტიდან ამოვარდნილი</label>
            </p>
            <p>
              <input
                type="checkbox"
                id="translation"
                onChange={checkboxHandler}
              />
              <label htmlFor="translation">გაუმართავი ქართული</label>
            </p>
            <p>
              <input
                type="checkbox"
                id="wrongAnswer"
                onChange={checkboxHandler}
              />
              <label htmlFor="wrongAnswer">მიუღებელი შინაარსი</label>
            </p>
          </fieldset>
          <button id = "butt" onClick = {buttonHandler} >შენახვა</button>
        </div>
      );
};

export default DislikeExt;
