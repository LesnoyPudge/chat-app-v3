import { FC, useState } from 'react';
import { Button, Conditional, Icon, ModalWindow, SearchBar, Separator, TextInput, UserAvatar } from '@components';
import { ModalContainer, ModalContent, ModalHeader, ModalTitle } from '../../components';
import { conditional, copyToClipboard } from '@utils';
import { useThrottle } from '@hooks';



export const InviteToChannelModal: FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const { throttle, isThrottling } = useThrottle();

    const channelName = 'лошок111';
    const invitationCode = 'https://wow.ru/123';

    const privateChats = Array(0).fill('').map((_, index) => {
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

    const filtredPrivateChats = privateChats.filter((privateChat) => {
        return privateChat.users[0].username.includes(searchValue);
    });

    const hasFriends = !!privateChats.length;
    const notEmptyList = !!filtredPrivateChats.length;
    const invitationCodeFieldLabel = conditional(
        'Или отправьте другу ссылку-приглашение на канал', 
        '', 
        hasFriends,
    );
    const copyButtonText = conditional('Скопировано!', 'Копировать', isThrottling);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);
    const handleReset = () => setSearchValue('');
    const handleCopyInvitation = () => {
        copyToClipboard(invitationCode);
        throttle(() => {}, 2000)();
    };

    return (
        <ModalWindow withBackdrop>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle className='text-start font-medium text-base truncated'>
                        <>Пригласить друзей на канал <strong>{channelName}</strong></>
                    </ModalTitle>
                </ModalHeader>

                <ModalContent>
                    <Conditional isRendered={hasFriends}>
                        <SearchBar
                            className='h-8'
                            value={searchValue}
                            onChange={handleChange}
                            onReset={handleReset}
                        />

                        <Separator spacing={16}/>

                        <Conditional isRendered={notEmptyList}>
                            <ul className='flex flex-col gap-1 max-h-[200px] overflow-y-auto scrollbar-primary'>
                                {filtredPrivateChats.map((privateChat) => {
                                    const user = privateChat.users[0];

                                    return (
                                        <li 
                                            className='flex justify-between gap-4 p-2 h-11 w-full hover:bg-hover focus-within:bg-hover items-center'
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
                            <p className='text-heading-m uppercase font-semibold'>
                                <>Никого не найдено</>
                            </p>
                        </Conditional>

                        <Separator spacing={16}/>
                    </Conditional>

                    <Conditional isRendered={!hasFriends}>
                        <p className='mb-3 text-sm'>
                            <>Поделитесь ссылкой-приглашением, чтобы предоставить доступ к этому каналу!</>
                        </p>
                    </Conditional>

                    <TextInput
                        name='invitationCode'
                        label={invitationCodeFieldLabel}
                        value={invitationCode}
                        readOnly
                        after={
                            <Button 
                                className='h-8 my-auto mx-1.5'
                                stylingPreset='brand'
                                onLeftClick={handleCopyInvitation}
                            >
                                {copyButtonText}
                            </Button>
                        }
                    />
                </ModalContent>
            </ModalContainer>
        </ModalWindow>
    );
};