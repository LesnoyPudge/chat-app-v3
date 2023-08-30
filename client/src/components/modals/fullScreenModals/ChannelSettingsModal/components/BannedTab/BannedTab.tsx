import { Button, ChannelSettingsModalFormValues, ChannelSettingsModalTabs, Image, OverlayContextProvider, SearchBar, Separator, TabContext, TabPanel, UnbanUserModal, UserAvatar } from '@components';
import { Heading, HeadingLevel } from '@libs';
import { FC, useContext } from 'react';
import { TabTitle } from '../../../components';
import { useTextInput } from '@hooks';
import { useFormikContext } from 'formik';
import { IMAGES } from '@generated';



const styles = {
    wrapper: 'pl-10 pb-[90px]',
    header: 'sticky top-0 pt-[60px] z-10 bg-primary-200',
    infoWrapper: 'flex items-center justify-between gap-2 flex-wrap mb-5',
    info: 'text-color-secondary',
    searchBar: 'h-8 max-w-[300px]',
    noBansWrapper: 'mt-10 mx-auto max-w-[300px] w-full text-color-secondary text-center',
    noBansImage: 'w-[256px] h-[212px] mb-10 mx-auto object-contain',
    noBansHeading: 'font-semibold text-heading-m uppercase mb-2',
    button: 'flex items-center gap-2.5 py-2 w-full',
    avatar: 'w-10 h-10',
    username: 'truncate text-color-primary',
};

export const BannedTab: FC = () => {
    const { tabPanelProps } = useContext<TabContext<ChannelSettingsModalTabs>>(TabContext);
    const { values } = useFormikContext<ChannelSettingsModalFormValues>();
    const { handleChange, handleReset, value } = useTextInput();

    const bannedUsers = [...Array(20)].map((_, i) => ({
        id: i.toString(),
        name: `banned ${i}`,
        avatar: `https://i.pravatar.cc/${50}`,
    }));

    const filteredBannedUsers = !value ? bannedUsers : bannedUsers.filter((user) => {
        return user.name.includes(value);
    });

    return (
        <TabPanel
            className={styles.wrapper}
            {...tabPanelProps.bannedTab}
        >
            <div className={styles.header}>
                <TabTitle>
                    <>Баны</>
                </TabTitle>

                <div className={styles.infoWrapper}>
                    <div className={styles.info}>
                        <>Показано - {filteredBannedUsers.length}</>
                    </div>

                    <SearchBar
                        className={styles.searchBar}
                        label='Поиск по имени'
                        placeholder='Введите имя пользователя'
                        value={value}
                        onChange={handleChange}
                        onReset={handleReset}
                    />
                </div>

                <Separator spacing={0}/>
            </div>

            <If condition={!bannedUsers.length}>
                <HeadingLevel>
                    <div className={styles.noBansWrapper}>
                        <Image
                            className=''
                            src={IMAGES.COMMON.BANHUMMER.PATH}
                        />

                        <Heading className={styles.noBansHeading}>
                            <>Нет банов</>
                        </Heading>

                        <div>
                            <>Вы ещё никого не банили... но если надо, не стесняйтесь!</>
                        </div>
                    </div>
                </HeadingLevel>
            </If>

            <If condition={!!bannedUsers.length}>
                <ul>
                    {filteredBannedUsers.map((user) => {
                        return (
                            <li key={user.id}>
                                <OverlayContextProvider>
                                    {({ openOverlay, isOverlayExist }) => (
                                        <>
                                            <Button
                                                className={styles.button}
                                                label='Разбанить пользователя'
                                                hasPopup='dialog'
                                                isActive={isOverlayExist}
                                                onLeftClick={openOverlay}
                                            >
                                                <UserAvatar
                                                    className={styles.avatar}
                                                    avatarId={user.avatar}
                                                    username={user.name}
                                                />

                                                <div className={styles.username}>
                                                    {user.name}
                                                </div>
                                            </Button>

                                            <UnbanUserModal
                                                channelId={values.channelId!}
                                                userId={user.id}
                                            />
                                        </>
                                    )}
                                </OverlayContextProvider>

                                <Separator spacing={0}/>
                            </li>
                        );
                    })}
                </ul>
            </If>
        </TabPanel>
    );
};