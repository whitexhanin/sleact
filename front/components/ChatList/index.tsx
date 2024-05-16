
// import { IDM } from '@typings/db';
import { IChat, IDM, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import dayjs from 'dayjs';
import React, { FC, RefObject, useMemo } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useParams } from 'react-router';
import useSWR from 'swr';

import { ChatZone } from '@components/ChatList/styles';
import regexifyString from 'regexify-string';
import { Link } from 'react-router-dom';
import Chat from '@components/Chat';

interface Props {
    scrollbarRef: RefObject<Scrollbars>;
    // isReachingEnd?: boolean;
    // isEmpty: boolean;
    chatDatas?: IDM[] | IChat[] | any;    
    // makeSection ?: IChat[] | IDM[] | IUser[] | undefined ;
    // setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
    chatScroll: any;
    chatbook : { [key: string]: (IDM | IChat)[] };   
    
  }


const ChatList:FC<Props> = ({chatDatas : chatData , chatScroll , chatbook , scrollbarRef}) => {

    const {workspace , id} = useParams<{workspace : string , id:string}>();  
    // const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>( 
    //     `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    //     fetcher
    //   );    
    
    console.log('chatData test ', chatData);

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
    console.log('chatbook',chatbook);

    //d.content 에 @멘션을 추출 해서 Link 를 만들고 workspace dm 을 보낼수있게 한다.
    // const result = regexifyString({
    //     pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
    //     decorator(match, index) {
    //       const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
    //       if (arr) {
    //         return (
    //           <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
    //             @{arr[1]}
    //           </Link>
    //         );
    //       }
    //       return <br key={index} />;
    //     },
    //     input: data.content,
    //   })
    // });

    // const result = useMemo<(string | JSX.Element)[] | JSX.Element>(
    //     () =>
    //       data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') ? (
    //         <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} />
    //       ) : (
    //         regexifyString({
    //           pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
    //           decorator(match, index) {
    //             const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
    //             if (arr) {
    //               return (
    //                 <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
    //                   @{arr[1]}
    //                 </Link>
    //               );
    //             }
    //             return <br key={index} />;
    //           },
    //           input: data.content,
    //         })
    //       ),
    //     [workspace, data.content],
    //   );

    return(
        <ChatZone>
            <Scrollbars autoHide onScrollFrame={chatScroll} ref ={scrollbarRef}>     
            <div>
                {Object.entries(chatbook).map( ([date,data])=> {
                    return(
                        <>
                            <div key={date}>{date}</div>
                            {data.map((d : any) => (
                                <Chat key = {d.id} data = {d}/>
                            ))}
                        </>
                    )
                }

                )}    
                
            </div>           
                {/* <div>{chatbook?.map((chat:any) => {
                    return (
                        <div>
                            <div>{chat.createdAt}</div>
                            <div>{chat.content}</div>
                        </div>                        
                    )                                        
            })}
            </div> */}
            </Scrollbars>
        </ChatZone>
    )
}

export default ChatList;