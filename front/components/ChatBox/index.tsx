import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/styles';
import useInput from '@hooks/useInput';
import { IDM, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import autosize from 'autosize';
import axios from 'axios';
import gravatar from 'gravatar';

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
    
    const {workspace , id} = useParams<{workspace : string , id:string}>();   
    const { data: myData } = useSWR('/api/users', fetcher,{
        dedupingInterval:2000,
    });        
    const { data : memberdata } = useSWR<IUser[]>(
        myData? `/api/workspaces/${workspace}/members` : null,
          fetcher          
      );

      console.log('memberdata1' , memberdata);

    // const {workspace , id} = useParams<{workspace : string , id:string}>();  
    // // const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>( 
    // //     `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    // //     fetcher
    // //   );    
      
    const textareaRef = useRef<HTMLTextAreaElement>(null);  
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
    },[onSubmitForm]);

    // const renderUserSuggestion: (
    //     suggestion: SuggestionDataItem,
    //     search: string,
    //     highlightedDisplay: React.ReactNode,
    //     index: number,
    //     focused: boolean,
    //   ) => React.ReactNode = useCallback(
    //     (member, search, highlightedDisplay, index, focus) => {
    //       if (!memberdata) {
    //         return null;
    //       }
    //       return (
    //         <EachMention focus={focus}>
    //           <img src={gravatar.url(memberdata[index].email, { s: '20px', d: 'retro' })} alt={memberdata[index].nickname} />
    //           <span>{highlightedDisplay}</span>
    //         </EachMention>
    //       );
    //     },
    //     [memberdata],
    //   );

    const renderUserSuggestion = useCallback((
        suggestion: SuggestionDataItem,
        search: string,
        highlightedDisplay: React.ReactNode,
        index: number,
        focus: boolean,
    ) : React.ReactNode => {
        if (!memberdata) {
            return null;
        }
        return (
            <EachMention focus={focus}>
               <img src={gravatar.url(memberdata[index].email, { s: '20px', d: 'retro' })} alt={memberdata[index].nickname} />
               <span>{highlightedDisplay}</span>
             </EachMention>
        )

    },[memberdata])
    
    return(
        <>                   
            <div className="chatarea" style={{border:'1px dashed #000'}}>
                <form onSubmit={onSubmitForm} style={{marginBottom:'0'}}>
                    <MentionsTextarea 
                        id="editor-chat"                    
                        inputRef={textareaRef} 
                        value={chat}
                        onChange={onChangeChat}
                        onKeyDown={onKeydownChat}           
                        allowSuggestionsAboveCursor            
                    >                        
                        <Mention
                            appendSpaceOnAdd
                            trigger="@"
                            data={memberdata?.map((v) => ({ id: v.id, display: v.nickname })) || []}
                            renderSuggestion={renderUserSuggestion}                                                       
                        />
                        {/* <Mention
                            trigger="#"
                            data={this.requestTag}
                            renderSuggestion={this.renderTagSuggestion} 커서 보다 위쪽에 

                        />                                               */}
                    </MentionsTextarea>
                    <div className="toolbox">
                        <button>전송</button>
                    </div>                
                </form>                
            </div>
        </>
    )
}

export default ChatBox;