
// import { IDM } from '@typings/db';
import { IChat, IDM } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

interface Props {
    // scrollbarRef: RefObject<Scrollbars>;
    // isReachingEnd?: boolean;
    // isEmpty: boolean;
    chatData?: IChat[] | IDM[];
    // setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  }


const ChatList:FC<Props> = ({chatData}) => {

    // const {workspace , id} = useParams<{workspace : string , id:string}>();  
    // const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>( 
    //     `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    //     fetcher
    //   );    

    return(
        <div className="chatzone">
            <div className="scrollbars">
            {chatData?.map((chats) => (
                <section>
                    <header className="stickyheader">
                        <button>[{chats.createdAt}]</button>
                    </header>
                    <div className='chat'>
                        {chats.content}
                    </div>
                </section>
            ))}
            </div>
        </div>
    )
}

export default ChatList;