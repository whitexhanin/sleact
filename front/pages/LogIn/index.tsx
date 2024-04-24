import React , { useState , useCallback }from "react";
import useInput from '@hooks/useInput';
import fetcher from "@utils/fetcher";
import { Form , Label , Input , Button , Error , Success , LinkContainer } from "./styles";
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import useSWR from "swr";

const LogIn = () => {

    const {data , error, mutate} = useSWR('http://localhost:3095/api/users', fetcher);
    const [email , onChangeEmail] = useInput('');
    const [password ,onChangePassword] = useInput('');
    const [loginError , setLoginError] = useState(false);
    console.log('in login' , data, error);
    
    const onSubmit = useCallback(
        (e) => {        
            e.preventDefault();  
            setLoginError(false);
            axios.post(
                'http://localhost:3095/api/users/login' ,
                 {email,password},
                 {withCredentials: true,}
                 )          
            .then((response)=>{
                mutate(response.data );
                console.log('login then',response)
            })
            .catch((error) =>{
                console.dir(error);
                setLoginError(error.response?.data?.statusCode === 401);
            })           
        },
        [email,password]        
    );

    console.log('out login' , data, error);

    if(data) {        
        {console.log('data있음')}
        return (            
            <Redirect to="/workspace/sleact/channel/일반" />
        )
    }
    if(data === undefined){
        return <div>로딩중...</div>
    }

    return (
        <>
            <div>Login</div>
            <Form onSubmit={onSubmit}>
                <Label>
                    <span>EMAIL</span>
                    <Input type="email" name="email" value={email} onChange={onChangeEmail}/>
                </Label>              
                <Label>
                    <span>Password</span>
                    <Input type="password" name="password" value={password} onChange={onChangePassword}/>                
                </Label>                           
                <Button type="submit">Submit</Button>                   
                {loginError  && <Error></Error>}
                {/* {signupSuccess && <Success></Success>} */}
            </Form>                       
            <LinkContainer>                
                <Link to ="/signup" >회원가입하러가기</Link>
            </LinkContainer>
        </>
    )
}

export default LogIn;