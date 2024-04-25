import React, { useState } from 'react';
import { CollapseButton } from './styles';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import { IUser, IUserWithOnline } from '@typings/db';
import { NavLink } from 'react-router-dom';

// interface Props  {
//     memberData? : IUser,
// }

const DMList = () => {
    const {workspace} = useParams<{workspace : string}>();
    const [directCollapse , setDirectCollapse] = useState(true);
    const [isOnline , setIsOnline] = useState(false);
    const {data:userData , error , mutate} = useSWR<IUser>(`/api/users`,fetcher,{dedupingInterval:2000});
    const {data : memberData} = useSWR<IUserWithOnline[]>(userData? `/api/workspaces/${workspace}/members` : null ,fetcher)
    
    console.log(memberData);
    const onCollapseButtonToggle = () => {
        setDirectCollapse(prev => !prev);
    }
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
            {!directCollapse && memberData?.map((member) => { return (            
                <NavLink key={member.nickname} to={`/workspace/${workspace}/dm/${member.id}`}>{member.nickname}</NavLink>
            )               
            })}
        </div>


        </>
    )
};

export default DMList;