import { FC } from 'react';
import { MessageImages, MessageReactions, MessageRedactor } from '..';



const styles = {
    gap: 'my-1.5',
};

export const MessageAdditions: FC = () => {
    return (
        <>
            <MessageRedactor className={styles.gap}/>

            <MessageImages className={styles.gap}/>
        
            <MessageReactions className={styles.gap}/>
        </>
    );
};