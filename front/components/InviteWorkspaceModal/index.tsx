import React, { VFC, useCallback, useState } from "react";
import  Modal  from '@components/Modal';
import  useInput  from '@hooks/useInput';
import { useParams } from "react-router";
import axios from "axios";
import { toast } from 'react-toastify';



interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowCreateChannelModal: (flag: boolean) => void;
}

const InviteWorkspaceModal: VFC<Props> = ({show,onCloseModal,setShowCreateChannelModal}) => {

    const [newEmail, onChangeNewEmail , setNewEmail] = useInput('');    
    const { workspace, channel } = useParams<{workspace:string; channel : string;}>();
    const onCreateInvite = useCallback((e)=>{
        e.preventDefault();
        
        axios.post(`http://localhost:3095/api/workspaces/${workspace}/members`,{
            email: newEmail
        },
        {
            withCredentials: true,
        },
    )
    .then(() => {
        setShowCreateChannelModal(false);
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
        <form onSubmit={onCreateInvite}>
            <label id="channel=label">
                <span>초대 받을 사람</span>
                <input type="text" id="channel" value={newEmail} onChange={onChangeNewEmail}/>
            </label>
            <button>초대하기</button>
        </form>
    </Modal>
      
 )
}

export default InviteWorkspaceModal;