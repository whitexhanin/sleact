import React , { useState , useCallback }from "react";
import useInput from '@hooks/useInput';

import { Form , Label , Input , Button , Error , Success , LinkContainer } from "./styles";

import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import useSWR from "swr";
import fetcher from "@utils/fetcher";


const SignUp = () => {    
    const [email , onChangeEmail] = useInput('');
    const [nickname , onChangeName] = useInput('');
    const [password , _1, setPassword] = useInput('');
    const [checkpassword , _2, setCheckpassword] = useInput('');
    const [mismatchError , setMismatchError] = useState(false);
    const [mistextError , setMistextError] = useState(false);
    const [signupError , setSignupError] = useState('');
    const [signupSuccess , setSignupSuccess] = useState(false);

    const {data , error, mutate} = useSWR('http://localhost:3095/api/users', fetcher);
        console.log(data);
    const onSubmit = useCallback(
        (e) => {        
            e.preventDefault();            
            if(!mismatchError && nickname){
                console.log('성공');
                setSignupError('');
                setSignupSuccess(false);
                axios.post('/api/users', {
                    email,
                    nickname,
                    password,
                },
                {withCredentials: true,}
            )
                .then((response) => {
                    console.log(response);                    
                    setSignupSuccess(true);
                })
                .catch((error) => {
                    console.log(error.response);
                    setSignupError(error.response.data);
                })
                .finally(() => {});
            }
        },
        [email,nickname,password ,checkpassword ,mismatchError]
    )

    const onChangePassword = useCallback(
        (e) => {
            setPassword(e.target.value);            
        },
        [password]
    )
    const onChangeCheckPassword = useCallback(
        (e) => {
            setCheckpassword(e.target.value);
            setMismatchError(e.target.value !== password);
        },
        [checkpassword]
    )
    console.log('signupSuccess있음?' , signupSuccess);
    if(signupSuccess){
        console.log('signupSuccess있음?' , signupSuccess);
        return <Redirect to="/login" />
    }

    return(
        <>
            <div>SignUp</div>
            <Form onSubmit={onSubmit}>
                <Label>
                    <span>EMAIL</span>
                    <Input type="email" name="email" value={email} onChange={onChangeEmail}/>
                </Label>
                <Label>
                    <span>Name</span>
                    <Input type="text" name="name" value={nickname} onChange={onChangeName}/>     
                    {mistextError && <Error>이름을 입력 하세요.</Error>}                  
                </Label>
                <Label>
                    <span>Password</span>
                    <Input type="password" name="password" value={password} onChange={onChangePassword}/>                
                </Label>
                <Label>
                    <span>Check Password</span>
                    <Input type="password" name="checkpassword" value={checkpassword} onChange={onChangeCheckPassword}/>                                    
                    {mismatchError && <Error>비밀번호가 일치 하지 않습니다.</Error>}
                </Label>               
                <Button type="submit">Submit</Button>                   
                {signupError  && <Error>{signupError}</Error>}
                {signupSuccess && <Success>회원가입완료</Success>}
            </Form>                       
            <LinkContainer>                
                <Link to ="/login">로그인 하러가기</Link>
            </LinkContainer>
        </>   
    )
}

export default SignUp;