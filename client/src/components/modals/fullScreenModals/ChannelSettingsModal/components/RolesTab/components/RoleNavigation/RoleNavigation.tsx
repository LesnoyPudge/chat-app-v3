import { FC, useContext, useRef } from 'react';
import { Button,SpriteImage, TabList, Tooltip, TabContext, Scrollable, List, Ref , MoveFocusInside } from '@components';
import { TabTitle } from '../../../../../components';
import { objectKeysToIdArray, twClassNames } from '@utils';
import { useKeyboardNavigation } from '@hooks';




const styles = {
    wrapper: 'sticky top-0 h-dvh max-w-[231px] w-full flex flex-col pt-[60px]',
    header: 'flex justify-between gap-2 mb-6 pr-4 pl-6',
    title: 'mb-0',
    createRoleButton: 'w-6 h-6 p-1 fill-icon-100',
    createRoleIcon: 'w-full h-full',
    list: 'flex flex-col gap-1 pl-10 pb-24 pr-2',
    roleItem: {
        base: `flex items-center w-full gap-2 py-1.5 px-2.5 rounded 
        hover:bg-primary-hover focus-visible:bg-primary-hover`,
        active: 'bg-primary-hover',
    },
    roleIndicator: 'w-3 h-3 rounded-full',
    roleName: 'truncate font-medium text-sm text-color-primary',
};

const roles = Array(32).fill('').map((_, index) => ({
    id: index.toString(),
    name: `role${index}`,
    color: 'rgb(34 197 94)',
}));

export const RoleNavigation: FC = () => {
    const { changeTab, tabs, isActive, tabProps } = useContext<TabContext<Record<string, string>>>(TabContext);
    const tabsRef = useRef(objectKeysToIdArray(tabs));
    const {
        getIsFocused,
        getTabIndex,
        setRoot,
        withFocusSet,
    } = useKeyboardNavigation(tabsRef);

    const handleCreateRole = () => console.log('create role');

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <TabTitle className={styles.title}>
                    <>Роли</>
                </TabTitle>

                <Ref<HTMLButtonElement>>
                    {(ref) => (
                        <>
                            <Button
                                className={styles.createRoleButton}
                                label='Создать роль'
                                innerRef={ref}
                                onLeftClick={handleCreateRole}
                            >
                                <SpriteImage
                                    className={styles.createRoleIcon}
                                    name='PLUS_ICON'
                                />
                            </Button>

                            <Tooltip
                                preferredAlignment='top'
                                spacing={5}
                                boundsSize={0}
                                leaderElementRef={ref}
                            >
                                <>Создание роли</>
                            </Tooltip>
                        </>
                    )}
                </Ref>
            </div>

            <Scrollable>
                <TabList
                    className={styles.list}
                    label='Список ролей'
                    orientation='vertical'
                    innerRef={setRoot}
                    tabIndex={0}
                >
                    <List list={roles}>
                        {({ color, id, name }) => (
                            <MoveFocusInside enabled={getIsFocused(id)}>
                                <Button
                                    className={twClassNames(
                                        styles.roleItem.base,
                                        { [styles.roleItem.active]: isActive[id] },
                                    )}
                                    label={`Редактировать роль ${name}`}
                                    tabIndex={getTabIndex(id)}
                                    {...tabProps[id]}
                                    onLeftClick={withFocusSet(id, changeTab[id])}
                                >
                                    <div
                                        className={styles.roleIndicator}
                                        style={{
                                            backgroundColor: color,
                                        }}
                                    ></div>

                                    <div className={styles.roleName}>
                                        {name}
                                    </div>
                                </Button>
                            </MoveFocusInside>
                        )}
                    </List>
                </TabList>
            </Scrollable>
        </div>
    );
};