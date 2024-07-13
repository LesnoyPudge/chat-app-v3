import { LoadedEntityContext } from "@components";
import { RT } from "@lesnoypudge/types-utils-react/namespace";
import { Heading } from "@libs";
import { AppSelectors, UserSelectors } from "@redux/features";
import { useMemoSelectorV2 } from "@redux/hooks";
import { FC, useContext } from "react";



const styles = {
    wrapper: 'p-4',
    heading: 'font-bold text-3xl my-2 text-color-primary',
    text: 'text-color-secondary',
};

const RoomIntro: FC = () => {
    const [room] = useContext(LoadedEntityContext.Room);

    return (
        <div className={styles.wrapper}>
            <Heading className={styles.heading}>
                <>Добро пожаловать в комнату {room.name}!</>
            </Heading>

            <span className={styles.text}>
                <>Это начало комнаты {room.name}.</>
            </span>
        </div>
    )
}

const PrivateChannelIntro: FC = () => {
    const [privateChannel] = useContext(LoadedEntityContext.PrivateChannel);
    const {id} = useMemoSelectorV2(AppSelectors.selectMe)
    const userId = privateChannel.members.find((_id) => _id !== id);
    if (!userId) return null;

    const user = useMemoSelectorV2(UserSelectors.selectById(userId));
    if (!user) return null;

    return (
        <div className={styles.wrapper}>
            <Heading className={styles.heading}>
                {user.username}
            </Heading>

            <span className={styles.text}>
                <>Это начало истории ваших личных сообщений с {user.username}.</>
            </span>
        </div>
    )
}

export const Introduction: FC<RT.PropsWithClassName> = ({
    className = '',
}) => {
    const [chat] = useContext(LoadedEntityContext.Chat);

    return (
        <div className={className}>
            <If condition={chat.owner === 'Room'}>
                <RoomIntro/>
            </If>

            <If condition={chat.owner === 'PrivateChannel'}>
                <PrivateChannelIntro/>
            </If>
        </div>
    )
}