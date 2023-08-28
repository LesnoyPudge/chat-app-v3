import { Button,SpriteImage, List, ModalWindow, OverlayContext, Scrollable, SearchBar, UserAvatar } from '@components';
import { useTextInput } from '@hooks';
import { getRandomNumber } from '@utils';
import { FC, useContext } from 'react';
import { IUserPreview } from '@backendTypes';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../components';



const styles = {
    resultWrapper: 'mt-4 h-[250px] flex justify-center items-center',
    scrollable: 'h-full',
    list: 'flex flex-col gap-2',
    item: 'flex justify-between items-center gap-2 px-2 py-1',
    userInfo: 'flex gap-2',
    avatar: 'w-8 h-8',
    username: '',
    addButton: `w-8 h-8 p-1.5 rounded-full bg-primary-300 hover:bg-primary-400 
    focus-visible:bg-primary-400 fill-icon-300 hover:fill-icon-100
    focus-visible:fill-icon-100`,
    addButtonIcon: 'w-full h-full',
};

const users = Array(20).fill('').map((_, index) => {
    return {
        id: index.toString(),
        username: `user ${index}`,
        avatar: `https://i.pravatar.cc/${50}`,
    } as IUserPreview;
});

const AddFriendModalInner: FC = () => {
    const { closeOverlay } = useContext(OverlayContext);
    const { value, handleChange, handleReset } = useTextInput();

    const usersToShow = users.filter((user) => {
        return user.username.includes(value);
    });

    const emptySearch = !value;
    const showUserList = !!usersToShow.length && !!value;
    const noUsersFound = !usersToShow.length && !!value;

    return (
        <ModalContainer>
            <ModalHeader>
                <ModalTitle>
                    <>Добавить в друзья</>
                </ModalTitle>

                <ModalSubtitle>
                    <>Вы можете добавить друга по имени. Вводите с УчЁтОм РаСкЛаДкИ!</>
                </ModalSubtitle>
            </ModalHeader>

            <ModalContent>
                <SearchBar
                    placeholder='Введите имя пользователя'
                    label='Имя пользователя'
                    value={value}
                    onChange={handleChange}
                    onReset={handleReset}
                />

                <div className={styles.resultWrapper}>
                    <If condition={!emptySearch}>
                        <If condition={showUserList}>
                            <Scrollable
                                className={styles.scrollable}
                                small
                            >
                                <ul className={styles.list}>
                                    <List list={usersToShow}>
                                        {({ username, avatar }) => {
                                            const handleAddFriend = () => {
                                                console.log('add to friends', username);
                                            };

                                            return (
                                                <li className={styles.item}>
                                                    <div className={styles.userInfo}>
                                                        <UserAvatar
                                                            className={styles.avatar}
                                                            avatarId={avatar}
                                                            username={username}
                                                        />

                                                        <span className={styles.username}>
                                                            {username}
                                                        </span>
                                                    </div>

                                                    <Button
                                                        className={styles.addButton}
                                                        label={`Добавить ${username} в друзья`}
                                                        onLeftClick={handleAddFriend}
                                                    >
                                                        <SpriteImage
                                                            className={styles.addButtonIcon}
                                                            name='PLUS_ICON'
                                                        />
                                                    </Button>
                                                </li>
                                            );
                                        }}
                                    </List>
                                </ul>
                            </Scrollable>
                        </If>

                        <If condition={noUsersFound}>
                            <div>
                                <>Пользователи не найдены</>
                            </div>
                        </If>
                    </If>

                    <If condition={emptySearch}>
                        <div>
                            <>Начните вводить имя</>
                        </div>
                    </If>
                </div>
            </ModalContent>

            <ModalFooter>
                <Button
                    stylingPreset='lite'
                    size='medium'
                    onLeftClick={closeOverlay}
                >
                    <>Отмена</>
                </Button>
            </ModalFooter>
        </ModalContainer>
    );
};

export const AddFriendModal: FC = () => {
    return (
        <ModalWindow
            label='Добавить друзей'
            withBackdrop
        >
            <AddFriendModalInner/>
        </ModalWindow>
    );
};