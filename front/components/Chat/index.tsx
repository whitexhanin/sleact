import { IChat, IDM } from "@typings/db";
import dayjs from "dayjs";
import React, { FC, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import regexifyString from "regexify-string";

interface Props {
    data : IDM | IChat | any;
}

const Chat : FC<Props> = ({data}) => {

    const {workspace , id} = useParams<{workspace : string , id:string}>();  



    const result = useMemo<(string | JSX.Element)[] | JSX.Element>(
        () =>
        //   data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') ? (
        //     <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} />
        //   ) : (

            regexifyString({
              pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
              decorator(match, index) {
                const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
                if (arr) {
                  return (
                    <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                      @{arr[1]}
                    </Link>
                  );
                }
                return <br key={index} />;
              },
              input: data.content,
            })
        //   )
          ,
        [workspace, data.content],
      );


    return(
        <>
        <div>                                       
            {/* <span>{data.Sender.nickname}</span> */}
            <span>{dayjs(data.createdAt).format('h:mm A')}</span>
            <div>{result}</div>
        </div>
        </>
    )
}

export default Chat;