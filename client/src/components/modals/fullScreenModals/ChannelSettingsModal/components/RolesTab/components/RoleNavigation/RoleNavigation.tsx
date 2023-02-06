import { FC, useContext } from 'react';
import { RefContextProvider, ArrowFocusContextProvider, Button, Icon, ArrowFocusItem, TabList, Tooltip, TabContext, Scrollable } from '@components';
import { TabTitle } from '../../../../../components';
import { twClassNames } from '@utils';



const styles = {
    wrapper: 'sticky top-0 h-screen max-w-[231px] w-full flex flex-col pt-[60px]',
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
    const { changeTab, tabs, isActive, tabProps } = useContext(TabContext) as TabContext<Record<string, string>>;

    const handleCreateRole = () => console.log('create role');
    
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <TabTitle className={styles.title}>
                    <>Роли</>
                </TabTitle>

                <RefContextProvider>
                    <Button
                        className={styles.createRoleButton}
                        label='Создать роль'
                        onLeftClick={handleCreateRole}
                    >
                        <Icon
                            className={styles.createRoleIcon}
                            iconId='plus-icon'
                        />
                    </Button>

                    <Tooltip
                        preferredAligment='top'
                        spacing={5}
                        boundsSize={0}
                    >
                        <>Создание роли</>
                    </Tooltip>
                </RefContextProvider>
            </div>

            <Scrollable>
                <ArrowFocusContextProvider 
                    list={tabs} 
                    orientation='vertical'
                >
                    <TabList 
                        className={styles.list}
                        label='Список ролей' 
                        orientation='vertical'
                    >
                        {roles.map(({ id, color, name }) => (
                            <ArrowFocusItem id={id} key={id}>
                                {({ tabIndex }) => (
                                    <Button
                                        className={twClassNames(
                                            styles.roleItem.base,
                                            { [styles.roleItem.active]: isActive[id] },
                                        )}
                                        label={`Редактировать роль ${name}`}
                                        tabIndex={tabIndex}
                                        {...tabProps[id]}
                                        onLeftClick={changeTab[id]}
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
                                )}
                            </ArrowFocusItem>
                        ))}
                    </TabList>
                </ArrowFocusContextProvider>
            </Scrollable>
        </div>
    );
};