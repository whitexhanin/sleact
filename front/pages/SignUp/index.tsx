import React , { useState , useCallback }from "react";
import useInput from '@hooks/useInput';

import { Form , Label , Input , Button , Error , Success , LinkContainer } from "./styles";

import { Link } from 'react-router-dom';



const SignUp = () => {
    const [bool,setbool] = useState(true);

    const [email , setEmail] = useInput('');

    const onSubmit = () => {

    }

    const onChangeEmail = () => {


    }

    const onChangeName = () => {


    }

    const onChangePassword = () => {

    }

    const onChangeCheckPassword = () => {

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
                    <Input type="text" name="name" value={username} onChange={onChangeName}/>                
                </Label>
                <Label>
                    <span>Password</span>
                    <Input type="password" name="password" value={password} onChange={onChangePassword}/>                
                </Label>
                <Label>
                    <span>Check Password</span>
                    <Input type="password" name="checkpassword" value={checkpassword} onChange={onChangeCheckPassword}/>                
                </Label>
                {bool?<Error>err text</Error> : <Success>success text</Success>}
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