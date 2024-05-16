import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import { IChat, IDM , IUser } from '@typings/db';
import fetcher from "@utils/fetcher";
import React, { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import useSWRInfinite from 'swr/infinite'
import gravatar from 'gravatar';
import axios from "axios";
import useInput from "@hooks/useInput";
import useSocket from "@hooks/useSocket";
import dayjs from "dayjs";
import Scrollbars from "react-custom-scrollbars-2";



const PAGE_SIZE = 20;

const DirectMesseage = () => {    
    const [chat, onChangeChat, setChat] = useInput('');    
    const {workspace , id} = useParams<{workspace : string , id:string}>();   
    const { data: myData } = useSWR('/api/users', fetcher);   
    const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);    
    
    const { data: chatData, mutate: mutateChat ,size,setSize,isValidating} = useSWRInfinite((index)=> 
        `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`
    ,fetcher, {
        onSuccess(data) {
          if (data?.length === 1) {
            setTimeout(() => {
              scrollbarRef.current?.scrollToBottom();
            }, 100);
          }
        },
      },

);
    // const { data: chatData, mutate: mutateChat } = useSWRInfinite<IDM[]>( 
    //     `/api/workspaces/${workspace}/dms/${id}/chats?perPage=40&page=2`,
    //     fetcher
    // );  

    //chatData 날짜 별로 그룹핑 하기
    const chatDataGroup  = <T extends IDM | IChat> (chatData : T[])=> {
        const sections : { [key : string]: T[]}= {};

        chatData.forEach((chat) => {
            let monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');    
            if(Array.isArray(sections[monthDate])){
              sections[monthDate].push(chat);
            }else {
              sections[monthDate] = [chat];
            }
        });
        return sections;        
    }
    
    const chatbook = chatDataGroup(chatData? ([] as IDM[]).concat(...chatData).reverse() : []);
    
    console.log('type chatbook', chatbook);
    const isEmpty = chatData?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE);
    const scrollbarRef = useRef<Scrollbars>(null);   
    const chatScroll = useCallback(
        (values) => {
            console.log(values.scrollTop);
          if (values.scrollTop === 0 && !isReachingEnd && !isEmpty) {
            setSize((size) => size + 1).then(() => {
              scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
            });
          }
        },
        [setSize, scrollbarRef, isReachingEnd, isEmpty],
      );
    
    // (e) => {
    //     console.log('scroll')
    //     //스크롤을 최대 위로 올렸을때 , isEmpty가 아니면 setSize + 1 ;

    //     // if(){

    //     // }
    // };
          
    const { data : memberdata } = useSWR<IUser | false | any>(
        userData? `/api/workspaces/${workspace}/members` : null,
          fetcher          
      );
    const [socket] = useSocket(workspace);

    const onSubmitForm = useCallback((e)=>{        
        e.preventDefault();
        //새로운 dm을 보냈다
        // Socket.io로 노노 서버로 보내는건 login 밖에 없다
            // mutateChat((prevChatData) => {
            //     console.log('prevChatData',prevChatData);  
            //     return prevChatData;          
            // },false) 
       
        axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`,{
            content:chat ,
        })
        .then(()=>{    
            mutateChat(); 
            setChat('');
        })
       
        .catch(console.error);    
    },[workspace , id , chat , mutateChat]);     


    const onMessage = useCallback((data) => {
        console.log('onmessage');
        mutateChat();
    },[id, myData, mutateChat]);

    useEffect(()=>{
        socket?.on('dm',onMessage);
        return () =>{ socket?.off('dm',onMessage)}
    },[socket, onMessage])

    //chatData를 날짜 별로 section 하기
    
    // let sectiondata = chatData? ([] as IDM[]).concat(...chatData).reverse() : []
    // console.log('sectiondata',sectiondata);

    // const makeSection  = <T extends IDM | IChat> (sectiondata : T[]) => {        
    //     const sections: { [key: string]: T[] } = {};

    //     console.log('makesection');

    //     sectiondata.forEach((chat)=>{
    //         const month =  dayjs(chat.createdAt).format('YYYY-MM-DD');

    //         console.log('month',month);
    //         console.log('isarray',Array.isArray(sections[month]));            

    //         if(Array.isArray(sections[month])){
    //             sections[month].push(chat);
    //         }else{
    //             sections[month] = [chat];
    //         }
    //     });
    //     return sections;
    // }

    // const chatSections = makeSection(sectiondata);

    if(userData == undefined){
        console.log('undefined');
        return null
    }    
    
    return (       
        <div className="container" style= {{width:'500px',display:'flex',flexDirection:'column'}}>
            <header>
                <img src={gravatar.url(userData.email,{s:'36px', d:'retro'})} alt={userData.nickname}/>
                <span>{userData.nickname}</span>
            </header>
            <ChatList chatDatas = {chatData} chatScroll = {chatScroll} chatbook={chatbook} scrollbarRef={scrollbarRef}/>
            <ChatBox onSubmitForm ={onSubmitForm} onChangeChat ={onChangeChat} chat = {chat} />
        </div>           
    )
}

export default DirectMesseage;

//컴포넌트를 공통으로 사용 할때는 socket이 있어도 props 를 사용 해야 하는 경우가 있다.
