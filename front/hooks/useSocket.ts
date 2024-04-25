//컴포넌트 간 공통 요소 중 화면이 들어기지 않는다면, HOOK에 하면 됨.
import io , {Socket} from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095';

const sockets : {[key: string]: Socket } = {};
const useSocket = (workspace : any) => {
    const disconnect = useCallback(()=>{
        if(workspace){
            sockets[workspace].disconnect();
            delete sockets[workspace];
        }
    },[workspace]);

    if(!workspace){
        return [undefined, disconnect];
    }

    if(!sockets[workspace]){
        sockets[workspace] = io(`${backUrl}/ws-${workspace}`,{
            transports: ['websocket'],// polling 하지 말고 websocket만 써라(ex ie9버전 은 http만 받아서 http먼저 보내고 websocket으로 보냄)
        })
    }    

    return [sockets[workspace], disconnect];
}

export default useSocket;

// socket 사용 방법
// 소켓 연결
// const socket = io.connect(`${backUrl}`); - 모든 사용자가 됨
// const socket = io.connect(`${backUrl}/ws-sleact`) - 세부 사용자를 경로로 만들어야함
// 소켓 서버로 데이터로 보냄
// socket.emit('hello','world');
// 소켓 서버에서 데이터 받기 + off 는 셋트
// socket.on('message', (data) =>{ console.log(data)})
// socket.off('message')
// 소켓 연결 끊기 + 지우기
//  socket.disconnect();
// delete sockets[workspace];

//동시에 여러 워크스페이스를 들어갈경우를 위해 sockets 를 객체로 만들기
// const sockets = {};
// const sockets[workspace] = io.connect(`${backUrl}/ws-workspace`);
//워크스페이스가 꼭 있어야 하니 없다면 return
// if(!workspace){ return [undefined , disconnect] ;}
// return [sockets[workspace],disconnect] return  값은게 좋다.


// }
