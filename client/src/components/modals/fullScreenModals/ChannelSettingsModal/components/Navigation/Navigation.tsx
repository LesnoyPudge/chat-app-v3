import { FC, useContext } from 'react';
import { ArrowFocusContextProvider, ArrowFocusItem, Button, ChannelSettingsModalTabs, Separator, TabContext, TabList } from '@components';
import { NavigationHeading, NavigationItem } from '../../../components';



const styles = {
    list: 'flex flex-col gap-0.5',
};

export const Navigation: FC = () => {
    const { tabs, changeTab, isActive } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;
    
    return (
        <ArrowFocusContextProvider list={tabs} direction='vertical'>
            <TabList label='Настройки канала' orientation='vertical'>
                <NavigationHeading>
                    <>Канал лошок111</>
                </NavigationHeading>

                <div className={styles.list}>
                    <ArrowFocusItem id={tabs.overviewTab.identifier}>
                        {({ tabIndex }) => (
                            <Button
                                isActive={isActive.overviewTab}
                                label='Обзор канала'
                                role='tab'
                                controls={tabs.overviewTab.identifier}
                                tabIndex={tabIndex}
                                onLeftClick={changeTab.overviewTab}
                            >
                                <NavigationItem isActive={isActive.overviewTab}>
                                    <>Обзор</>
                                </NavigationItem>
                            </Button>
                        )}
                    </ArrowFocusItem>

                    <ArrowFocusItem id={tabs.rolesTab.identifier}>
                        {({ tabIndex }) => (
                            <Button
                                isActive={isActive.rolesTab}
                                label='Роли канала'
                                role='tab'
                                controls={tabs.rolesTab.identifier}
                                tabIndex={tabIndex}
                                onLeftClick={changeTab.rolesTab}
                            >
                                <NavigationItem isActive={isActive.rolesTab}>
                                    <>Роли</>
                                </NavigationItem>
                            </Button>
                        )}
                    </ArrowFocusItem>
                </div>

                <Separator spacing={16}/>

                <NavigationHeading>
                    <>Управление участниками</>
                </NavigationHeading>

                <div className={styles.list}>
                    <ArrowFocusItem id={tabs.membersTab.identifier}>
                        {({ tabIndex }) => (
                            <Button
                                isActive={isActive.membersTab}
                                label='Участники канала'
                                role='tab'
                                controls={tabs.membersTab.identifier}
                                tabIndex={tabIndex}
                                onLeftClick={changeTab.membersTab}
                            >
                                <NavigationItem isActive={isActive.membersTab}>
                                    <>Участники</>
                                </NavigationItem>
                            </Button>
                        )}
                    </ArrowFocusItem>

                    <ArrowFocusItem id={tabs.bannedTab.identifier}>
                        {({ tabIndex }) => (
                            <Button
                                isActive={isActive.bannedTab}
                                label='Забаненные пользователи'
                                role='tab'
                                controls={tabs.bannedTab.identifier}
                                tabIndex={tabIndex}
                                onLeftClick={changeTab.bannedTab}
                            >
                                <NavigationItem isActive={isActive.bannedTab}>
                                    <>Баны</>
                                </NavigationItem>
                            </Button>
                        )}
                    </ArrowFocusItem>
                </div>

                <Separator spacing={16}/>

                <Button
                    label='Удалить канал'
                    onLeftClick={() => console.log('delete channel')}
                >
                    <NavigationItem>
                        <>Удалить канал</>
                    </NavigationItem>
                </Button>
            </TabList>
        </ArrowFocusContextProvider>
    );
};