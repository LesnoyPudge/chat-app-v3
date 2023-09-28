import { PropsWithClassName } from '@types';
import { FC, useContext } from 'react';
import { Button, EntityContext } from '@components';
import { twClassNames } from '@utils';
import { styles } from '../../styles';
import { UserApi } from '@redux/features';



export const MessageEditorBlocked: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const [user] = useContext(EntityContext.User);
    const [unblock] = UserApi.useUserUnblockMutation();

    const handleClick = async() => {
        if (!user) return;

        await unblock({ targetId: user.id });
    };

    return (
        <div className={twClassNames(
            styles.wrapper,
            styles.sizeLimit,
            className,
        )}>
            <Button
                onLeftClick={handleClick}
            >
                <>qwe</>
            </Button>
        </div>
    );
};