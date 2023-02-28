import { FC } from 'react';
import { MessageControlBar, MessageImages, MessageReactions, MessageRedactor } from '..';



const styles = {
    gap: 'my-1.5',
};

export const MessageAdditions: FC = () => {
    return (
        <>
            <MessageControlBar/>

            <MessageRedactor className={styles.gap}/>

            <MessageImages className={styles.gap}/>
        
            <MessageReactions className={styles.gap}/>
        </>
    );
};