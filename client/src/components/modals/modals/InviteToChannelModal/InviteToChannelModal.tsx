import { FC } from 'react';
import { Button, Conditional, FieldLabel, Icon, Id, ModalWindow, SearchBar, Separator, TextInput, TextInputWrapper, UserAvatar } from '@components';
import { ModalContainer, ModalContent, ModalHeader, ModalTitle } from '../../components';
import { conditional, copyToClipboard } from '@utils';
import { useSearch, useThrottle } from '@hooks';



export const InviteToChannelModal: FC = () => {
    const { searchValue, handleChange, handleReset } = useSearch();
    const { throttle, isThrottling } = useThrottle();

    const channelName = 'лошок111';
    const invitationCode = 'https://wow.ru/123';

    const privateChats = Array(5).fill('').map((_, index) => {
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
        return privateChat.users[0].username.includes(searchValue);
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
                    <ModalTitle className='text-start font-medium text-base truncated'>
                        <>Пригласить друзей на канал <strong>{channelName}</strong></>
                    </ModalTitle>
                </ModalHeader>

                <ModalContent>
                    <Conditional isRendered={haveFriends}>
                        <SearchBar
                            className='h-8'
                            label='Поиск друзей по имени'
                            value={searchValue}
                            onChange={handleChange}
                            onReset={handleReset}
                        />

                        <Separator spacing={16}/>

                        <Conditional isRendered={notEmptyList}>
                            <ul className='flex flex-col gap-1 max-h-[200px] overflow-y-auto scrollbar-primary'>
                                {filteredPrivateChats.map((privateChat) => {
                                    const user = privateChat.users[0];

                                    return (
                                        <li 
                                            className='flex justify-between gap-4 p-2 h-11 w-full hover:bg-primary-hover focus-within:bg-primary-hover items-center'
                                            key={privateChat.id}
                                        >
                                            <div className='flex gap-2.5 items-center'>
                                                <UserAvatar
                                                    className='h-8 w-8'
                                                    avatar={user.avatar}
                                                    username={user.username}
                                                />

                                                <span className='truncated font-medium'>
                                                    {user.username}
                                                </span>
                                            </div>

                                            <Button
                                                className='h-full aspect-square p-1.5 rounded-full bg-primary-400 hover:bg-primary-300
                                            focus-visible:bg-primary-300 fill-icon-300 hover:fill-icon-100
                                            focus-visible:fill-icon-100'
                                            >
                                                <Icon
                                                    className='w-full h-full'
                                                    iconId='plus-icon'
                                                />
                                            </Button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </Conditional>

                        <Conditional isRendered={!notEmptyList}>
                            <p className='text-center text-heading-m uppercase font-semibold'>
                                <>Никого не найдено</>
                            </p>
                        </Conditional>

                        <Separator spacing={16}/>
                    </Conditional>

                    <Conditional isRendered={!haveFriends}>
                        <p className='mb-3 text-sm'>
                            <>Поделитесь ссылкой-приглашением, чтобы предоставить доступ к этому каналу!</>
                        </p>
                    </Conditional>

                    <div>
                        <Id>
                            {({ id }) => (
                                <>
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
                                            className='h-8 my-auto mx-1.5'
                                            stylingPreset='brand'
                                            onLeftClick={handleCopyInvitation}
                                        >
                                            {copyButtonText}
                                        </Button>
                                    </TextInputWrapper>
                                </>
                            )}
                        </Id>
                    </div>
                </ModalContent>
            </ModalContainer>
        </ModalWindow>
    );
};