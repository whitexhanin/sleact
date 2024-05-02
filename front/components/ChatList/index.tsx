
// import { IDM } from '@typings/db';
import { IChat, IDM } from '@typings/db';
import fetcher from '@utils/fetcher';
import dayjs from 'dayjs';
import React, { FC } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useParams } from 'react-router';
import useSWR from 'swr';

interface Props {
    // scrollbarRef: RefObject<Scrollbars>;
    // isReachingEnd?: boolean;
    // isEmpty: boolean;
    chatData?: IChat[] | IDM[];
    makeSection ?: IChat[] | IDM[] | any;
    // setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  }


const ChatList:FC<Props> = ({chatData , makeSection}) => {

    // const {workspace , id} = useParams<{workspace : string , id:string}>();  
    // const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>( 
    //     `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    //     fetcher
    //   );    

    // console.log(makeSection);

    return(
        <div className="chatzone">
            <Scrollbars autoHide>
                <div>makeSection
                {makeSection? Object.entries(makeSection).map(([date, chats]) => {
                    return (
                        <div>
                            <button>{date}</button>
                        </div>
                    )
                }) : null}
                     
                </div>
                {chatData?.map((chats) => (
                    <section>
                        <header className="stickyheader">
                            <button>
                                {dayjs(chats.createdAt).format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A')}
                            </button>
                        </header>
                        <div className='chat'>
                            {dayjs(chats.createdAt).format('h:mm A')}
                            {chats.content}
                        </div>
                    </section>
                ))}
            </Scrollbars>
        </div>
    )
}

export default ChatList;