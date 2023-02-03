import { FC, useContext } from 'react';
import { ArrowFocusContextProvider, ArrowFocusItem, Button, ChannelSettingsModalTabs, Icon, Separator, TabContext, TabList } from '@components';
import { NavigationHeading, NavigationItem } from '../../../components';



const styles = {
    list: 'flex flex-col gap-0.5',
    button: 'group w-full',
    deleteChannelIcon: 'w-4 h-4',
};

export const Navigation: FC = () => {
    const { tabs, changeTab, isActive, tabProps } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;
    
    return (
        <div>
            <ArrowFocusContextProvider list={tabs} orientation='vertical'>
                <TabList label='Настройки канала' orientation='vertical'>
                    <NavigationHeading>
                        <>Канал лошок111</>
                    </NavigationHeading>

                    <div className={styles.list}>
                        <ArrowFocusItem id={tabs.overviewTab.identifier}>
                            {({ tabIndex }) => (
                                <Button
                                    className={styles.button}
                                    isActive={isActive.overviewTab}
                                    label='Обзор канала'
                                    tabIndex={tabIndex}
                                    {...tabProps.overviewTab}
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
                                    className={styles.button}
                                    isActive={isActive.rolesTab}
                                    label='Роли канала'
                                    tabIndex={tabIndex}
                                    {...tabProps.rolesTab}
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
                                    className={styles.button}
                                    isActive={isActive.membersTab}
                                    label='Участники канала'
                                    tabIndex={tabIndex}
                                    {...tabProps.membersTab}
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
                                    className={styles.button}
                                    isActive={isActive.bannedTab}
                                    label='Забаненные пользователи'
                                    tabIndex={tabIndex}
                                    {...tabProps.bannedTab}
                                    onLeftClick={changeTab.bannedTab}
                                >
                                    <NavigationItem isActive={isActive.bannedTab}>
                                        <>Баны</>
                                    </NavigationItem>
                                </Button>
                            )}
                        </ArrowFocusItem>
                    </div>
                </TabList>
            </ArrowFocusContextProvider>

            <Separator spacing={16}/>

            <Button
                className={styles.button}
                label='Удалить канал'
                onLeftClick={() => console.log('delete channel')}
            >
                <NavigationItem>
                    <>Удалить канал</>

                    <Icon
                        className={styles.deleteChannelIcon}
                        iconId='garbage-can-icon'
                    />
                </NavigationItem>
            </Button>
        </div>
    );
};