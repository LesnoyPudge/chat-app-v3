import { FC } from 'react';
import { Button, Conditional, FieldLabel,SpriteImage, Id, List, ModalWindow, Scrollable, SearchBar, Separator, TextInput, TextInputWrapper, UserAvatar } from '@components';
import { ModalContainer, ModalContent, ModalHeader, ModalTitle } from '../../components';
import { conditional, copyToClipboard } from '@utils';
import { useTextInput, useThrottle } from '@hooks';



const styles = {
    title: 'text-start font-medium text-base truncated',
    searchBar: 'h-8',
    content: 'flex justify-center items-center h-[200px]',
    scrollable: 'h-full',
    list: 'flex flex-col gap-1',
    item: `flex justify-between gap-4 p-2 h-11 w-full hover:bg-primary-hover 
    focus-within:bg-primary-hover items-center`,
    userInfo: 'flex gap-2.5 items-center',
    userAvatar: 'h-8 w-8',
    userName: 'truncated font-medium',
    addButton: `h-full aspect-square p-1.5 rounded-full bg-primary-400 
    hover:bg-primary-300 focus-visible:bg-primary-300 fill-icon-300 
    hover:fill-icon-100 focus-visible:fill-icon-100`,
    addIcon: 'w-full h-full',
    notFound: 'text-center text-heading-m uppercase font-semibold',
    share: 'mb-3 text-sm',
    copyButton: 'h-8 my-auto mx-1.5',
};

export const InviteToChannelModal: FC = () => {
    const { value, handleChange, handleReset } = useTextInput();
    const { throttle, isThrottling } = useThrottle();

    const channelName = 'лошок111';
    const invitationCode = 'https://wow.ru/123';

    const privateChats = Array(15).fill('').map((_, index) => {
        return {
            id: index.toString(),
            users: [
                {
                    id: index.toString(),
                    username: `friend ${index}`,
                    avatar: `https://i.pravatar.cc/5${index}`,
                },
            ],
        };
    });

    const filteredPrivateChats = privateChats.filter((privateChat) => {
        return privateChat.users[0].username.includes(value);
    });

    const haveFriends = !!privateChats.length;
    const notEmptyList = !!filteredPrivateChats.length;
    const copyButtonText = conditional('Скопировано!', 'Копировать', isThrottling);

    const handleCopyInvitation = () => {
        copyToClipboard(invitationCode);
        throttle(() => {}, 2000)();
    };

    return (
        <ModalWindow
            withBackdrop
            label='Пригласить на канал'
        >
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle className={styles.title}>
                        <>Пригласить друзей на канал <strong>{channelName}</strong></>
                    </ModalTitle>
                </ModalHeader>

                <ModalContent>
                    <Conditional isRendered={haveFriends}>
                        <SearchBar
                            className={styles.searchBar}
                            label='Поиск друзей по имени'
                            placeholder='Поиск друзей по имени'
                            value={value}
                            onChange={handleChange}
                            onReset={handleReset}
                        />

                        <Separator spacing={16}/>

                        <div className={styles.content}>
                            <Conditional isRendered={notEmptyList}>
                                <Scrollable className={styles.scrollable}>
                                    <ul className={styles.list}>
                                        <List list={filteredPrivateChats}>
                                            {(privateChat) => {
                                                const user = privateChat.users[0];

                                                return (
                                                    <li className={styles.item}>
                                                        <div className={styles.userInfo}>
                                                            <UserAvatar
                                                                className={styles.userAvatar}
                                                                avatarId={user.avatar}
                                                                username={user.username}
                                                            />

                                                            <span className={styles.userName}>
                                                                {user.username}
                                                            </span>
                                                        </div>

                                                        <Button className={styles.addButton}>
                                                            <SpriteImage
                                                                className={styles.addIcon}
                                                                name='PLUS_ICON'
                                                            />
                                                        </Button>
                                                    </li>
                                                );
                                            }}
                                        </List>
                                    </ul>
                                </Scrollable>
                            </Conditional>

                            <Conditional isRendered={!notEmptyList}>
                                <p className={styles.notFound}>
                                    <>Никого не найдено</>
                                </p>
                            </Conditional>
                        </div>

                        <Separator spacing={16}/>
                    </Conditional>

                    <Conditional isRendered={!haveFriends}>
                        <p className={styles.share}>
                            <>Поделитесь ссылкой-приглашением, чтобы предоставить доступ к этому каналу!</>
                        </p>
                    </Conditional>

                    <Id>
                        {(id) => (
                            <div>
                                <Conditional isRendered={haveFriends}>
                                    <FieldLabel htmlFor={id}>
                                        <>Или отправьте другу ссылку-приглашение на канал</>
                                    </FieldLabel>
                                </Conditional>

                                <TextInputWrapper>
                                    <TextInput
                                        name='invitationCode'
                                        label='Ссылка-приглашение на канал'
                                        value={invitationCode}
                                        id={id}
                                        readOnly
                                    />

                                    <Button
                                        className={styles.copyButton}
                                        stylingPreset='brand'
                                        onLeftClick={handleCopyInvitation}
                                    >
                                        {copyButtonText}
                                    </Button>
                                </TextInputWrapper>
                            </div>
                        )}
                    </Id>
                </ModalContent>
            </ModalContainer>
        </ModalWindow>
    );
};