
import fetcher from '@utils/fetcher';
import React , { useState }from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { CollapseButton } from '@components/DMList/styles';
import { NavLink } from 'react-router-dom';
import { IChannel, IUser } from '@typings/db';

interface Props {
    channelData? : IChannel[],
    IUser? : IUser
}


const ChannelList = () => {

    const { workspace , channel } = useParams<{workspace : string , channel : string}>();
    const {data : userData , error , mutate : userMutate } = useSWR('/api/users', fetcher, {dedupingInterval: 2000});
    const {data : channelData} = useSWR<IChannel[]>(userData? `/api/workspaces/${workspace}/channels` : null , fetcher)    
    const [channelCollapse , setChannelCollapse] = useState(true);

    const onCollapseButtonToggle = () => {
        setChannelCollapse((prev)=>!prev);
    }

    console.log(channelData);

    return (
        <>  <h2>
                <CollapseButton onClick = {onCollapseButtonToggle} collapse={channelCollapse}>
                <i
                className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
                data-qa="channel-section-collapse"
                aria-hidden="true"
                />                
                </CollapseButton>  
                채널 리스트
            </h2>     
            <div>
                {!channelCollapse && channelData?.map((v)=>{ return <div key={v.name}># {v.name}</div>})}
            </div>
        </>
    )
}

export default ChannelList;

