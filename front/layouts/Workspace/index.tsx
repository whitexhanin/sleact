import React, {VFC, useCallback, useState  } from "react";
import { Header , RightMenu , ProfileImg , WorkspaceWrapper , Workspaces , Channels , WorkspaceName , Chats , MenuScroll , ProfileModal , LogOutButton , WorkspaceButton ,AddButton , WorkspaceModal  } from "./styles";
import  useSWR  from "swr";
import fetcher from "@utils/fetcher";
import axios from "axios";
import loadable from '@loadable/component';
import { Redirect, Route, Switch , Link, useParams } from "react-router-dom";
import gravatar from 'gravatar';
import { ToastContainer, toast } from 'react-toastify';


const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));


import Menu from '@components/Menu';
import { IUser , IChannel } from "@typings/db";
import Modal from "@components/Modal";
import { Input, Label } from "@pages/LogIn/styles";
import useInput from "@hooks/useInput";
import CreateChannelModal from "@components/CreateChannelModal";
import InviteWorkspaceModal from "@components/InviteWorkspaceModal";
import InviteChannelModal from "@components/InviteChannelModal";
import ChannelList from "@components/ChannelList";
import DMList from "@components/DMList";


const Workspace:VFC = ({}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);    
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);    
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);        
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);        
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
    const {workspace} = useParams<{workspace: string}>();    
    
    
    const {data : userData , error, mutate} = useSWR<IUser | false>('/api/users', fetcher,{
        dedupingInterval: 2000,
    });        
    const { data: channelData } = useSWR<IChannel[]>(
      userData? `/api/workspaces/${workspace}/channels` : null,
        fetcher
    );
    const { data: memberData } = useSWR<IUser | false | any>(
        userData? `/api/workspaces/${workspace}/members` : null,
          fetcher          
      );
      console.log(memberData);


    const onLogout = useCallback(() => {
        axios.post('/api/users/logout', null, {
            withCredentials: true,
        })
        .then(()=>{
            mutate();
        })
        .catch(error=>{
            console.dir(error);
        })
        
    },[]);

    const onClickUserProfile = useCallback(()=>{
        console.log('hi');
        setShowUserMenu(prev => !prev);
    },[]);

    const onCloseUserProfile = useCallback((e) =>{
        e.stopPropagation();
        setShowUserMenu(false);
    },[]);

    const onClickCreateWorkspace = useCallback(()=>{        
        setShowCreateWorkspaceModal(true);
    },[]);

    const onCloseModal = useCallback(()=>{
        console.log('bye');
        setShowCreateWorkspaceModal(false);
        setShowCreateChannelModal(false);
        setShowInviteWorkspaceModal(false);
        setShowInviteChannelModal(false);
    },[]);

    const onCreateWorkspace = useCallback((e)=>{
        e.preventDefault();
        if(!newWorkspace || !newWorkspace.trim()) return;
        if(!newUrl || !newUrl.trim()) return;
        axios
        .post('api/workspaces', {
            workspace: newWorkspace,
            url:newUrl,
        })
        .then(()=>{            
            mutate();
            setShowCreateWorkspaceModal(false); 
            setNewWorkspace('');
            setNewUrl('');
        })
        .catch((error)=>{
            console.dir(error);
            toast.error(error.response?.data,{position:'bottom-center'})
        })        
    },[newWorkspace, newUrl])


   

    const toggleWorkSpaceModal = useCallback(()=>{
        console.log();
        setShowWorkspaceModal((prev)=> !prev);

    },[]);

    const onClickAddChannel = useCallback(()=>{
        setShowCreateChannelModal((prev)=>!prev);

    },[]);

    const onClickInviteWorkspace = useCallback(()=>{
        setShowInviteWorkspaceModal(prev=>!prev);
    },[]);

    console.log('userData',userData);

    if(!userData){
        return <Redirect to="/login" />
    }

    return(
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(userData.email,{s:'28px', d:'retro'})} alt={userData.email}/>
                            {showUserMenu && 
                            <Menu 
                            style={{ right:0, top:38}} 
                            show={showUserMenu}
                            onCloseModal={onCloseUserProfile}>
                                <ProfileModal>
                                    <img src={gravatar.url(userData.email,{s:'36px', d:'retro'})} alt={userData.email}/>
                                    <div>
                                        <span id="profile-name">{userData.email}</span>
                                        <span id="profile-active">Active</span>
                                    </div>                                
                                </ProfileModal>
                                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                            </Menu>          
                            }                 
                    </span>                    
                </RightMenu>
            </Header>            
            <WorkspaceWrapper>
                <Workspaces>
                    {userData?.Workspaces?.map((ws)=>{
                        return (
                            <Link key={ws.id} to ={`/workspace/${123}/channels/일반`}>
                                <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        )
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName onClick={toggleWorkSpaceModal}>sleact</WorkspaceName>
                    <MenuScroll>                        
                        <Menu show={showWorkspaceModal} onCloseModal={toggleWorkSpaceModal} style={{ top:95,left:80}}>
                            <WorkspaceModal>
                                <h2>Sleact</h2>
                                <button onClick={onClickInviteWorkspace}>워크스페이스로 초대</button>
                                <button onClick={onClickAddChannel}>채널 만들기</button>
                                <button onClick={onLogout}>로그아웃</button>
                            </WorkspaceModal>
                        </Menu>                        
                        <ChannelList />                        
                        <DMList />                                                                        
                    </MenuScroll>
                </Channels>
                <Switch>
                    <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
                    <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
                </Switch>                
            </WorkspaceWrapper>
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>워크스페이스 이름</span>
                        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}/>
                    </Label>
                    <Label id="workspace-url-label">
                        <span>워크스페이스 url</span>
                        <Input id="workspace" value={newUrl} onChange={onChangeNewUrl}/>
                    </Label>
                    <button type="submit">생성하기</button>
                </form>
            </Modal>
            <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModal}
                                setShowCreateChannelModal={setShowCreateChannelModal}
            />            
            <InviteWorkspaceModal 
                show={showInviteWorkspaceModal}
                onCloseModal={onCloseModal}
                setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}            
            />
             <InviteChannelModal
                show={showInviteChannelModal}
                onCloseModal={onCloseModal}
                setShowInviteChannelModal={setShowInviteChannelModal}            
            />
        </div>
    )
}

export default Workspace;