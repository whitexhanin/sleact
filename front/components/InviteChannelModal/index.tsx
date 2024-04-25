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
    setShowInviteChannelModal: (flag: boolean) => void;
}

const InviteChannelModal: VFC<Props> = ({show,onCloseModal,setShowInviteChannelModal}) => {

    const [newEmail, onChangeNewEmail , setNewEmail] = useInput('');    
    const { workspace, channel } = useParams<{workspace:string; channel : string;}>();

    const {data : userData , error , mutate : userMutate} = useSWR<IUser>('/api/users', fetcher,{
        dedupingInterval: 2000,
    });
    
    
    const { data: memberData , mutate :  memberMutate } = useSWR<IChannel[]>(
      userData? `/api/workspaces/${workspace}/members` : null,
        fetcher
    );


    const onInviteChannelMember = useCallback((e)=>{
        e.preventDefault();
        
        axios.post(`/api/workspaces/${workspace}/channels/${channel}/members`,{
            email: newEmail
        },
        {
            withCredentials: true,
        },
    )
    .then(() => {
        memberMutate();
        setShowInviteChannelModal(false);
        setNewEmail('');
    })
    .catch((error)=>{
        //에러났을때 console.dir로 보면 에러 난걸 보기 쉬움
        console.dir(error);
        toast.error(error.response?.data,{position: 'bottom-center'});
    });

    },[])

    const stopPropagation = useCallback((e) => {
        e.stopPropagation();
    },[]);

    

    if(!show){
        return null;
    }

 return(
    <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onInviteChannelMember}>
            <label id="channelmember-label">
                <span>초대 받을 사람</span>
                <input type="text" id="channelmember" value={newEmail} onChange={onChangeNewEmail}/>
            </label>
            <button>보내기</button>
        </form>
    </Modal>      
 )
}

export default InviteChannelModal;