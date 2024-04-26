import React, { FC, useEffect, useState } from 'react';
import { CollapseButton } from './styles';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import { IUser, IUserWithOnline } from '@typings/db';
import { NavLink } from 'react-router-dom';
import useSocket from '@hooks/useSocket';

// interface Props  {
//     memberData? : IUser,
// }

const DMList : FC = () => {
    const {workspace} = useParams<{workspace? : string}>();

    const [directCollapse , setDirectCollapse] = useState(true);
    const [onlineList , setOnlineList] = useState<number[]>([]);

    const {data:userData , error , mutate} = useSWR<IUser>(`/api/users`,fetcher,{dedupingInterval:2000});
    const {data : memberData} = useSWR<IUserWithOnline[]>(userData? `/api/workspaces/${workspace}/members` : null ,fetcher);
    const [socket] = useSocket(workspace);

    useEffect(() => {
        setOnlineList([]);
    },[workspace]);
    

    useEffect(()=>{
        socket?.on('onlineList',(data:number[])=>{
            setOnlineList(data);
        });

        return () => {
            socket?.off('onlineList');
        }
    },[socket])
    
    
    console.log(memberData);
    const onCollapseButtonToggle = () => {
        setDirectCollapse(prev => !prev);
    }

    console.log('onlineList' , onlineList);

    return (
        <>
        <h2>
            <CollapseButton onClick = {onCollapseButtonToggle} collapse={directCollapse}>
                <i
                    className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
                    data-qa="channel-section-collapse"
                    aria-hidden="true"
                    />   
            </CollapseButton>
            <span>Direct Messages</span>            
        </h2>
        <div>            
            {!directCollapse && memberData?.map((member) => { 
                const isOnline = onlineList.includes(member.id);
                return (           
                <div key={member.id}>                                        
                    <NavLink  to={`/workspace/${workspace}/dm/${member.id}`}>
                        <i
                            className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                                isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                            }`}
                            aria-hidden="true"
                            data-qa="presence_indicator"
                            data-qa-presence-self="false"
                            data-qa-presence-active="false"
                            data-qa-presence-dnd="false"
                        />                        
                        {member.nickname}
                    </NavLink>
                </div>                        
            )               
            })}            
        </div>


        </>
    )
};

export default DMList;