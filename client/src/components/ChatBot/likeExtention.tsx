import React, { useEffect, useState } from "react";
import "react-chat-widget/lib/styles.css";

const  LikeExt = ( props : {func: Function, id:string}) => {
    const [optional,setOptional] = useState<string>("");
    const textHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setOptional(event.target.value);
    };
    const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (optional !== "") {
            props.func({like : 1,contextField : 0, contentField :0, convertField :0,message_id: props.id,optional_feedback: optional});
        }
    };
    return (
        <div className="container">
          <fieldset>
            <legend>გთხოვთ მიუთითოთ მიზეზი</legend>
            <p>
              <textarea placeholder = "რატომ მოგეწონათ ჟიპიტაურის პასუხი?"
                id="other"
                value={optional}
                onChange={textHandler}
              />
              <label htmlFor="other"></label>
            </p>
          </fieldset>
          <button id = "butt" onClick = {buttonHandler} >შენახვა</button>
        </div>
      );
};

export default LikeExt;
