
// import { IDM } from '@typings/db';
import { IChat, IDM, IUser } from '@typings/db';
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
    chatDatas?: IDM[] | IChat[] | any;    
    // makeSection ?: IChat[] | IDM[] | IUser[] | undefined ;
    // setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  }


const ChatList:FC<Props> = ({chatDatas : chatData }) => {

    // const {workspace , id} = useParams<{workspace : string , id:string}>();  
    // const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>( 
    //     `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    //     fetcher
    //   );    
    

    let sectiondata = chatData? ([] as IDM[]).concat(...chatData).reverse() : []
    console.log('sectiondata',sectiondata);

    const makeSection  = <T extends IDM | IChat> (sectiondata : T[]) => {        
        const sections: { [key: string]: T[] } = {};

        console.log('makesection');

        sectiondata.forEach((chat)=>{
            const month =  dayjs(chat.createdAt).format('YYYY-MM-DD');

            console.log('month',month);
            console.log('isarray',Array.isArray(sections[month]));            

            if(Array.isArray(sections[month])){
                sections[month].push(chat);
            }else{
                sections[month] = [chat];
            }
        });
        return sections;
    }

    const chatSections = makeSection(sectiondata);    

    return(
        <div className="chatzone">
            <Scrollbars autoHide>
                <div>makeSection
                    {chatSections? Object.entries(chatSections).map(([date, chats]) => {
                        return (
                            <div key={date}>
                                <button>{date}</button>                                
                                
                                {chats.map((chat:any)=>(<div key={chat.id}>{chat.content}</div>))}
                            </div>
                            // {chats?.map((chat)=>(
                                
                            //         <div>{chat}</div>
                                
                            // ))}
                            // {}
                            // {chats?.map((chat) => (
                            //     <section>
                            //         <header className="stickyheader">
                            //             <button>
                            //                 {dayjs(chat.createdAt).format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A')}
                            //             </button>
                            //         </header>
                            //         <div className='chat'>
                            //             {dayjs(chat.createdAt).format('h:mm A')}
                            //             {chat.content}
                            //         </div>
                            //     </section>
                            // ))}
                        )
                    }) : null}                     
                </div>
                {/* {chatData?.map((chats) => (
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
                ))} */}
            </Scrollbars>
        </div>
    )
}

export default ChatList;