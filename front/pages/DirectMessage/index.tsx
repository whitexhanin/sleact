import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import { IDM } from '@typings/db';
import fetcher from "@utils/fetcher";
import React, { useCallback } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import gravatar from 'gravatar';
import axios from "axios";
import useInput from "@hooks/useInput";

const DirectMesseage = () => {    
    const [chat, onChangeChat, setChat] = useInput('');    
    const {workspace , id} = useParams<{workspace : string , id:string}>();      
    const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);


    // const {workspace , id} = useParams<{workspace : string , id:string}>();  
    const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>( 
        `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
        fetcher
      );  

      const onSubmitForm = useCallback((e)=>{        
        e.preventDefault();
        //새로운 dm을 보냈다
        // Socket.io로 노노 서버로 보내는건 login 밖에 없다
        axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{
            content:chat ,
        })
        .then(()=>{     
            mutateChat();                   
            setChat('');
        })
        .catch(console.error);    
    },[workspace , id , chat , mutateChat]);     


    if(userData == undefined){
        console.log('undefined');
        return null
    }
    
    return (       
        <div className="container">
            <header>
                <img src={gravatar.url(userData.email,{s:'36px', d:'retro'})} alt={userData.nickname}/>
                <span>{userData.nickname}</span>
            </header>
            <ChatList chatData = {chatData} />
            <ChatBox onSubmitForm ={onSubmitForm} onChangeChat ={onChangeChat} chat = {chat}/>
        </div>           
    )
}

export default DirectMesseage;