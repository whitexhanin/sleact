import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/styles';
import useInput from '@hooks/useInput';
import { IDM, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import autosize from 'autosize';
import axios from 'axios';

import React, { FC, VFC , useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import { Mention, SuggestionDataItem } from 'react-mentions';
import gravatar from 'gravatar';

const ChatBox:VFC = () => {    
    const {workspace , id} = useParams<{workspace : string , id:string}>();    
    const {data : memberData} = useSWR<IUser[]>(`/api/workspaces/${workspace}/members`)
    const { data: chatData, mutate: mutateChat, setSize } = useSWRInfinite<IDM[]>(
        (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
        fetcher,
      );
    const [chat, onChangeChat, setChat] = useInput('');    
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);    

    useEffect(()=>{
        if (textareaRef.current) {
            autosize(textareaRef.current);
          }
    },[])

    const onSubmitForm = useCallback(()=>{
        //새로운 dm을 보냈다
        // Socket.io로 노노 서버로 보내는건 login 밖에 없다
        axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{
            content:chat
        }
    )
        .then(()=>{
            mutateChat();
        })
        .catch(console.error);        
    },[]);  
    

    const onKeydownChat  = useCallback(()=>{
        console.log('keydown');
    },[onSubmitForm])

    console.log('?');
    
    return(
        <>
            <div className="chatarea">
                <form onSubmit={onSubmitForm}>
                    <textarea 
                        id="editor-chat"                    
                        ref={textareaRef} 
                        value={chat}
                        onChange={onChangeChat}
                        onKeyDown={onKeydownChat}
                    >
                        <Mention
                            appendSpaceOnAdd
                            trigger="@"
                            data={memberData?.map((v)=>({id:v.id,display:v.nickname})) || []}
                            // renderSuggestion={renderSuggestion}
                        />
                    </textarea>
                    <div className="toolbox">
                        <button>전송</button>
                    </div>                
                </form>
            </div>
        </>
    )
}

export default ChatBox;