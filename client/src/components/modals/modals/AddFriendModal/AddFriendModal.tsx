import { Button, Conditional, Icon, ModalWindow, OverlayContext, SearchBar, UserAvatar } from '@components';
import { useThrottle } from '@hooks';
import { getRandomNumber } from '@utils';
import { FC, useContext, useState } from 'react';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../components';




interface FoundUser {
    id: string, 
    username: string, 
    avatar: string,
}

const style = {
    searchBar: 'h-10',
    resultWrapper: 'mt-4',
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

const AddFriendModalInner: FC = () => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;
    const [searchValue, setSearchValue] = useState('');
    const [foundUsers, setFoundUsers] = useState<FoundUser[]>([]);
    const { throttle } = useThrottle();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setSearchValue(value);

        if (!value) return;

        throttle(() => {
            const foundUsers = Array(getRandomNumber(1, 10)).fill('').map((_, index) => {
                return {
                    id: index.toString(),
                    username: `user ${index}`,
                    avatar: `https://i.pravatar.cc/${50 + index}`,
                } as FoundUser;
            });

            setFoundUsers(foundUsers);
        }, 2000)();
    };

    const handleReset = () => setSearchValue('');

    const showUserList = !!foundUsers.length && !!searchValue;
    const noUsersFound = !foundUsers.length && !!searchValue;

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
                    className={style.searchBar}
                    placeholder='Введите имя пользователя'
                    value={searchValue}
                    onChange={handleChange}
                    onReset={handleReset}
                />

                <div className={style.resultWrapper}>
                    <Conditional isRendered={showUserList}>
                        <ul className={style.list}>
                            {foundUsers.map(({ avatar, id, username }) => {
                                const handleAddFriend = () => {
                                    console.log('add to friends', username);
                                };

                                return (
                                    <li 
                                        className={style.item} 
                                        key={id}
                                    >
                                        <div className={style.userInfo}>
                                            <UserAvatar
                                                className={style.avatar}
                                                avatar={avatar}
                                                username={username}
                                            />

                                            <span className={style.username}>
                                                {username}
                                            </span>
                                        </div>

                                        <Button
                                            className={style.addButton}
                                            label={`Добавить ${username} в друзья`}
                                            onLeftClick={handleAddFriend}
                                        >
                                            <Icon
                                                className={style.addButtonIcon}
                                                iconId='plus-icon'
                                            />
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    </Conditional>

                    <Conditional isRendered={noUsersFound}>
                        <span>
                            <>Пользователи не найдены</>
                        </span>
                    </Conditional>
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