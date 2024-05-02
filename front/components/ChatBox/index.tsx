import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/styles';
import useInput from '@hooks/useInput';
import { IDM, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import autosize from 'autosize';
import axios from 'axios';

import React, {  FC , useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';
import useSocket from "@hooks/useSocket";

interface Props {
    onSubmitForm: (e: any) => void;
    chat?: string;
    onChangeChat: (e: any) => void;
    // placeholder: string;
    data?: IUser[];
  }

const ChatBox:FC<Props> = ({onChangeChat, onSubmitForm , chat , data}) => {    
    // const {workspace , id} = useParams<{workspace : string , id:string}>();  
    // // const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>( 
    // //     `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    // //     fetcher
    // //   );    
      
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);  
    // const [socket ,disconnectSocket]= useSocket(workspace);

    useEffect(()=>{
        if (textareaRef.current) {
            autosize(textareaRef.current);
          }
    },[])

    // const onSubmitForm = useCallback((e)=>{        
    //     e.preventDefault();
    //     //새로운 dm을 보냈다
    //     // Socket.io로 노노 서버로 보내는건 login 밖에 없다
    //     axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{
    //         content:chat ,
    //     })
    //     .then(()=>{     
    //         mutateChat();                   
    //         setChat('');
    //     })
    //     .catch(console.error);    
    // },[workspace , id , chat , mutateChat]);  
    

    const onKeydownChat  = useCallback((e)=>{      
        if(e.key == 'Enter' && !e.shiftKey){            
            onSubmitForm(e);
        }
    },[onSubmitForm])
    
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
                            data={data?.map((v)=>({ id: v.id,  display: v.nickname})) || []}                                                        
                        />
                        {/* <Mention
                            trigger="#"
                            data={this.requestTag}
                            renderSuggestion={this.renderTagSuggestion}
                        />                                               */}
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