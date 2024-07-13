import { List } from "@components";
import { FC, RefObject } from "react";
import { MessagePlaceholder } from "./components";



type MessagePlaceholders = {
    innerRef?: RefObject<HTMLDivElement>;
}

const styles = {
    placeholderList: 'flex flex-col gap-4',
};

export const MessagePlaceholders: FC<MessagePlaceholders> = ({
    innerRef,
}) => {
    return (
        <div 
            className={styles.placeholderList}        
            ref={innerRef}
            aria-hidden    
        >
            <List count={15}>
                <MessagePlaceholder/>
            </List>
        </div>
    )
}