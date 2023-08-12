import { BanMemberModal, Button, ChangeChannelOwnerModal, ChannelSettingsModalFormValues, ChannelSettingsModalTabs,SpriteImage, KickMemberModal, OverlayContextProvider, Ref, SearchBar, Separator, TabContext, TabPanel, Tooltip, UserAvatar } from '@components';
import { useTextInput } from '@hooks';
import { twClassNames } from '@utils';
import { useFormikContext } from 'formik';
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
    const { tabPanelProps } = useContext<TabContext<ChannelSettingsModalTabs>>(TabContext);
    const { value, handleChange, handleReset } = useTextInput();
    const { values } = useFormikContext<ChannelSettingsModalFormValues>();

    const members = [...Array(20)].map((_, index) => ({
        id: index.toString(),
        name: `member ${index}`,
        avatar: `https://i.pravatar.cc/${50}`,
    }));

    const filteredMembers = !value ? members : members.filter((member) => {
        return member.name.includes(value);
    });

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
                        value={value}
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
                                avatarId={member.avatar}
                                username={member.name}
                            />

                            <div className={styles.username}>
                                {member.name}
                            </div>

                            <div className={styles.buttonArea}>
                                <Ref<HTMLButtonElement>>
                                    {(ref) => (
                                        <>
                                            <OverlayContextProvider>
                                                {({ openOverlay, isOverlayExist }) => (
                                                    <>
                                                        <Button
                                                            className={twClassNames(styles.button, styles.dangerButton)}
                                                            label='Выгнать пользователя'
                                                            hasPopup='dialog'
                                                            isActive={isOverlayExist}
                                                            innerRef={ref}
                                                            onLeftClick={openOverlay}
                                                        >
                                                            <SpriteImage
                                                                className={styles.icon}
                                                                name='DOORWAY_ICON'
                                                            />
                                                        </Button>

                                                        <KickMemberModal
                                                            channelId={values.channelId}
                                                            memberId={member.id}
                                                        />
                                                    </>
                                                )}
                                            </OverlayContextProvider>

                                            <Tooltip
                                                preferredAlignment='top'
                                                leaderElementRef={ref}
                                            >
                                                <>Выгнать</>
                                            </Tooltip>
                                        </>
                                    )}
                                </Ref>

                                <Ref>
                                    {(ref) => (
                                        <>
                                            <OverlayContextProvider>
                                                {({ openOverlay, isOverlayExist }) => (
                                                    <>
                                                        <Button
                                                            className={twClassNames(styles.button, styles.dangerButton)}
                                                            label='Забанить пользователя'
                                                            hasPopup='dialog'
                                                            isActive={isOverlayExist}
                                                            onLeftClick={openOverlay}
                                                        >
                                                            <SpriteImage
                                                                className={styles.icon}
                                                                name='CROSS_ICON'
                                                            />
                                                        </Button>

                                                        <BanMemberModal
                                                            channelId={values.channelId}
                                                            memberId={member.id}
                                                        />
                                                    </>
                                                )}
                                            </OverlayContextProvider>

                                            <Tooltip
                                                preferredAlignment='top'
                                                leaderElementRef={ref}
                                            >
                                                <>Забанить</>
                                            </Tooltip>
                                        </>
                                    )}
                                </Ref>

                                <Ref<HTMLButtonElement>>
                                    {(ref) => (
                                        <>
                                            <OverlayContextProvider>
                                                {({ isOverlayExist, openOverlay }) => (
                                                    <>
                                                        <Button
                                                            className={styles.button}
                                                            label='Передать права на канал'
                                                            hasPopup='dialog'
                                                            isActive={isOverlayExist}
                                                            onLeftClick={openOverlay}
                                                        >
                                                            <SpriteImage
                                                                className={styles.icon}
                                                                name='CROWN_ICON'
                                                            />
                                                        </Button>

                                                        <ChangeChannelOwnerModal
                                                            channelId={values.channelId}
                                                            memberId={member.id}
                                                        />
                                                    </>
                                                )}
                                            </OverlayContextProvider>

                                            <Tooltip
                                                preferredAlignment='top'
                                                leaderElementRef={ref}
                                            >
                                                <>Передать права на канал</>
                                            </Tooltip>
                                        </>
                                    )}
                                </Ref>
                            </div>
                        </div>

                        <Separator spacing={0}/>
                    </div>
                ))}
            </div>
        </TabPanel>
    );
};