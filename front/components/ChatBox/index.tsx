import React, { FC, VFC , useCallback } from 'react';


const ChatBox:VFC = () => {

    const onKeyEvent = useCallback((e)=>{
        console.log(e);
        if(e.keycode == 'Enter'){
            console.log('enter');
        }

    },[]);

    

    
    return(
        <>
        <div>
            <form>
                <textarea onChange={onKeyEvent}></textarea>
                <button>전송</button>
            </form>
        </div>
        </>
    )
}

export default ChatBox;