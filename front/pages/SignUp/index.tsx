import React , { useState , useCallback }from "react";
import useInput from '@hooks/useInput';

import { Form , Label , Input , Button , Error , Success , LinkContainer } from "./styles";

import { Link } from 'react-router-dom';
import axios from "axios";



const SignUp = () => {    
    const [email , onChangeEmail] = useInput('');
    const [nickname , onChangeName] = useInput('');
    const [password , _1, setPassword] = useInput('');
    const [checkpassword , _2, setCheckpassword] = useInput('');
    const [mismatchError , setMismatchError] = useState(false);
    const [mistextError , setMistextError] = useState(false);

    const onSubmit = useCallback(
        (e) => {        
            e.preventDefault();            
            if(!mismatchError){
                console.log('서버로 회원가입 요청');
                axios.post('http://localhost:3095/api/users',{email,nickname,password})                
                .then((response)=>{
                    console.log(response);
                })
                .catch((error)=>{
                    console.log(error.response)
                })
            }

            if(!nickname){
                setMistextError(true);
            }
            console.log(email,nickname,password,checkpassword); 
        },
        [email,nickname,password,checkpassword,mismatchError]
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
            </Form>                       
            <LinkContainer>
                회원가입하러가기
                <Link to ="/login" />            
            </LinkContainer>
        </>   
    )
}

export default SignUp;