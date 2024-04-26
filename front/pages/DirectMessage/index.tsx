import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import React from "react";

const DirectMesseage = () => {
    return (       
        <div className="container">
            <header>
                <img src='' alt='' />
                <span>이름</span>
            </header>
            <ChatList />
            <ChatBox />
        </div>           
    )
}

export default DirectMesseage;