import { Button, ChannelSettingsModalTabs, Icon, RefContextProvider, SearchBar, Separator, TabContext, TabPanel, Tooltip, UserAvatar } from '@components';
import { useSearch } from '@hooks';
import { twClassNames } from '@utils';
import { FC, useContext } from 'react';
import { TabTitle } from '../../../components';



const styles = {
    wrapper: 'pl-10',
    header: 'sticky top-0 z-10 pt-[60px] bg-primary-200',
    infoWrapper: 'flex gap-4 justify-between items-center flex-wrap mb-5',
    info: 'flex gap-4 shrink-0 text-color-secondary',
    searchBar: 'h-7 max-w-[300px]',
    list: 'flex flex-col gap-5 pb-24',
    item: 'flex items-center gap-3 py-4',
    avatar: 'w-10 h-10',
    username: 'truncate font-medium text-sm text-color-primary',
    buttonArea: 'flex gap-2 ml-auto',
    button: 'w-9 h-9 bg-primary-400 fill-icon-100 rounded-full',
    dangerButton: 'fill-danger',
    icon: 'w-5 h-5 m-auto',
};

export const MembersTab: FC = () => {
    const { tabPanelProps } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;
    const { searchValue, handleChange, handleReset } = useSearch();

    const members = [...Array(20)].map((_, index) => ({
        id: index.toString(),
        name: `member ${index}`,
        avatar: `https://i.pravatar.cc/${50}`,
    }));

    const filteredMembers = !searchValue ? members : members.filter((member) => {
        return member.name.includes(searchValue);
    });

    const handleKick = () => console.log('kick');
    const handleBan = () => console.log('ban');
    const handleChangeOwner = () => console.log('change owner');

    return (
        <TabPanel 
            className={styles.wrapper}
            {...tabPanelProps.membersTab}
        >
            <div className={styles.header}>
                <TabTitle>
                    <>Участники канала</>
                </TabTitle>

                <div className={styles.infoWrapper}>
                    <div className={styles.info}>
                        <span>Всего — {members.length}</span>
                        <span>Показано — {filteredMembers.length}</span>
                    </div>

                    <SearchBar
                        className={styles.searchBar}
                        value={searchValue}
                        placeholder='Имя или роль участника'
                        label='Поиск по имени или роли участника'
                        onChange={handleChange}
                        onReset={handleReset}
                    />
                </div>

                <Separator spacing={0}/>
            </div>

            <div className={styles.list}>
                {filteredMembers.map((member) => (
                    <div key={member.id}>
                        <div className={styles.item}>
                            <UserAvatar
                                className={styles.avatar}
                                avatar={member.avatar}
                                username={member.name}
                            />

                            <div className={styles.username}>
                                {member.name}
                            </div>

                            <div className={styles.buttonArea}>
                                <RefContextProvider>
                                    <Button
                                        className={twClassNames(styles.button, styles.dangerButton)}
                                        label='Выгнать пользователя'
                                        onLeftClick={handleKick}
                                    >
                                        <Icon
                                            className={styles.icon}
                                            iconId='doorway-icon'
                                        />
                                    </Button>
                                
                                    <Tooltip preferredAligment='top'>
                                        <>Выгнать</>
                                    </Tooltip>
                                </RefContextProvider>

                                <RefContextProvider>
                                    <Button
                                        className={twClassNames(styles.button, styles.dangerButton)}
                                        label='Забанить пользователя'
                                        onLeftClick={handleBan}
                                    >
                                        <Icon
                                            className={styles.icon}
                                            iconId='cross-icon'
                                        />
                                    </Button>

                                    <Tooltip preferredAligment='top'>
                                        <>Забанить</>
                                    </Tooltip>
                                </RefContextProvider>

                                <RefContextProvider>
                                    <Button
                                        className={styles.button}
                                        label='Передать права на канал'
                                        onLeftClick={handleChangeOwner}
                                    >
                                        <Icon
                                            className={styles.icon}
                                            iconId='crown-icon'
                                        />
                                    </Button>

                                    <Tooltip preferredAligment='top'>
                                        <>Передать права на канал</>
                                    </Tooltip>
                                </RefContextProvider>
                            </div>
                        </div>

                        <Separator spacing={0}/>
                    </div>
                ))}
            </div>
        </TabPanel>
    );
};