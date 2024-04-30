import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import { IChat, IDM } from '@typings/db';
import fetcher from "@utils/fetcher";
import React, { useCallback } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import gravatar from 'gravatar';
import axios from "axios";
import useInput from "@hooks/useInput";

const Channel = () => {
    const [chat, onChangeChat, setChat] = useInput('');    
    const {workspace , id , channel} = useParams<{workspace : string , id:string , channel:string}>();      
    // const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);

    const { data: chatData, mutate: mutateChat } = useSWR<IChat[]>( 
        `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=1`,
        fetcher
      );  

    const onSubmitForm = useCallback((e)=>{        
        e.preventDefault();
        axios.post(`/api/workspaces/${workspace}/channels/${channel}/chats`,{
            content:chat ,
        })
        .then(()=>{     
            mutateChat();                   
            setChat('');
        })
        .catch(console.error);    
    },[workspace , id , chat , mutateChat]);    


    // if(userData == undefined){
    //     console.log('undefined');
    //     return null
    // }



    return (
            <div>
                채널                                  
                <ChatList chatData = {chatData} />
                <ChatBox onSubmitForm ={onSubmitForm} onChangeChat ={onChangeChat} chat = {chat}/>
            </div>
    )
}

export default Channel;