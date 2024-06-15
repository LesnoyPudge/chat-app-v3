import { PropsWithClassName } from '@types';
import { FC } from 'react';
import { Heading } from '@libs';
import { twClassNames } from '@utils';



const styles = {
    wrapper: 'p-4',
    heading: 'font-bold text-3xl my-2 text-color-primary',
    text: 'text-color-secondary',
};

export const HelloFromRoom: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const roomName = 'tmpRoomName';

    return (
        <div 
            className={twClassNames(styles.wrapper, className)}
            aria-hidden
        >
            <Heading className={styles.heading}>
                <>Добро пожаловать в комнату {roomName}!</>
            </Heading>

            <span className={styles.text}>
                <>Это начало комнаты {roomName}. </>
            </span>
        </div>
    );
};