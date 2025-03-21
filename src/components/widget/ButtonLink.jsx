import { useState } from "react";
import {
    FaList,
    FaPlus
  } from "react-icons/fa";

const ButtonLink = ({textContent, icon, onClick, className, key}) => {
    return (
        <>  
            <button onClick = {onClick()} className= {className}>
                {icon == 'list' ? <FaList></FaList>:<FaPlus></FaPlus>}  {textContent}
            </button>
        </>
    );
}

export default ButtonLink;