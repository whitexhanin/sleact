import React , {CSSProperties, FC, useCallback, useState} from 'react';
import { CreateMenu , CloseModalButton } from './styles';

interface Props {
    show: boolean;
    onCloseModal: (e: any) => void;
    style:CSSProperties;
    closeButton?:boolean;
}

const Menu:FC<Props> = ({children , style , onCloseModal , closeButton , show}) => {
    const stopPropagation = useCallback((e)=> {
        e.stopPropagation();
    },[]) 

    if(!show)  return null;
    
    return(
        <>
            <CreateMenu onClick = {onCloseModal}>
                <div onClick={stopPropagation} style={style}>
                    
                    메뉴
                    {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
                    {children}
                </div>
                
            </CreateMenu>            
        </>
    )

}
Menu.defaultProps = {
    closeButton: true,
}

export default Menu;