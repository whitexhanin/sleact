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
            transports: ['websoket'],
        })
    }

    return [sockets[workspace], disconnect];
}

export default useSocket;

