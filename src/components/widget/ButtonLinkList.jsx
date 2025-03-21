import { useContext } from "react";
import ButtonLink from "./ButtonLink";

export default function ButtonLinkList({buttonList = []}) {
    var buttonListWidget = [];
    for(let i = 0 ; i < buttonList.length; i++) {
        buttonListWidget.push(
            <div style={
                {marginRight:'5px', display:'inline-block'}
            }>
                <ButtonLink onClick={buttonList[i].onClick} textContent={buttonList[i].textContent} 
                    className={buttonList[i].className} icon={buttonList[i].icon}>
                </ButtonLink>
            </div>
        );
    }

    const keytest = new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000);
    return (
        <div style={{textAlign:'right'}} key={keytest}>
            {buttonListWidget}
        </div>
    );
  }
  