import React, { VFC, useCallback, useState } from "react";
// import  Modal  from '@components/Modal';

import  useInput  from '@hooks/useInput';
import { useParams } from "react-router";
import axios from "axios";
import { toast } from 'react-toastify';
import fetcher from "@utils/fetcher";
import { IUser , IChannel } from "@typings/db";
import useSWR from "swr";
import Modal from "@components/Modal";


interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({show,onCloseModal,setShowCreateChannelModal}) => {

    const [newChannel, onChangeNewChannel , setNewChannel] = useInput('');    
    const { workspace, channel } = useParams<{workspace:string; channel : string;}>();
    const {data : userData , error , mutate : userMutate} = useSWR<IUser>('/api/users', fetcher,{
        dedupingInterval: 2000,
    });
    
    //채널 생성시 확인 방법
    const { data: channelData , mutate :  channelMutate } = useSWR<IChannel[]>(
      userData? `/api/workspaces/${workspace}/channels` : null,
        fetcher
    );

    const onCreateChannel = useCallback((e)=>{
        e.preventDefault();
        //채널만드는 요청 보내기
        //현재 내가 어디 workspace에서 무슨 채널을 만들 것인가?
        //서버랑 잘 소통 하려면 어떠한 정보를 줘야 하는지 정확히 파악해야 한다
        //useParams로 주소의 정보를 사용 안하면 workspace의 정보를 state로 가져와야 하고
        //state를 사용 하는 곳마다 이동 / 저장 해야 한다 useParams가 간편한거 같음
        axios.post(`/api/workspaces/${workspace}/channels`,{
            name: newChannel,            
        },
        {
            withCredentials: true,
        },
        )
        .then((response) => {       
            console.log('보내짐');         
            channelMutate();     
            setShowCreateChannelModal(false);            
            setNewChannel('');
        })
        .catch((error)=>{
            //에러났을때 console.dir로 보면 에러 난걸 보기 쉬움
            console.dir(error);
            toast.error(error.response?.data,{position: 'bottom-center'});
        });
    

    },[newChannel])    

    const stopPropagation = useCallback((e) => {
        e.stopPropagation();
    },[]);

    

    if(!show){
        return null;
    }

 return(
    
    <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateChannel} onClick={stopPropagation}>
            <label id="channel-label">
                <span>채널</span>
                <input type="text" id="channel" value={newChannel} onChange={onChangeNewChannel}/>
            </label>
            <button>생성하기</button>
        </form>
    </Modal>
      
 )
}

export default CreateChannelModal;