import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import React from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import gravatar from 'gravatar';

const DirectMesseage = () => {    
    const {workspace , id} = useParams<{workspace : string , id:string}>();  
    // const {data : userData} = useSWR<IUser[]>(`/api/workspaces/${workspace}/users/${id}`,fetcher);
    const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);

    console.log('userData9' , userData);

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
            <ChatList />
            <ChatBox />
        </div>           
    )
}

export default DirectMesseage;