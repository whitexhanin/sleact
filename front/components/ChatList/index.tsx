
import React, { FC, VFC , useCallback, useEffect, useRef } from 'react';



const ChatList = () => {

    return(
        <div className="chatzone">
            <div className="scrollbars">
                <section>
                    <header className="stickyheader">
                        <button>날짜</button>
                    </header>
                    <div className='chat'>
                        채팅 내용
                    </div>
                </section>
            </div>
        </div>

    )

}

export default ChatList;