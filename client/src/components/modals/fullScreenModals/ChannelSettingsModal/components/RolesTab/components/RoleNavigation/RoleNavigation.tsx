import { FC, useContext } from 'react';
import { RefContextProvider, ArrowFocusContextProvider, Button, Icon, ArrowFocusItem, TabList, Tooltip, TabContext } from '@components';
import { TabTitle } from '../../../../../components';
import { twClassNames } from '@utils';



const styles = {
    wrapper: 'flex flex-col h-full shrink-0 max-w-[232px] w-full pt-[60px] border-r-2 border-primary-100',
    header: 'flex justify-between gap-2 mb-6 pl-6 pr-4',
    listWrapper: 'scrollbar-primary scrollbar-with-gutter h-full overflow-y-auto',
    list: 'flex flex-col gap-0.5 pl-8 pr-2 pb-[60px]',
    roleItem: {
        base: `flex items-center w-full gap-2 py-1.5 px-2.5 rounded-md 
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
                <TabTitle className='m-0'>
                    <>Роли</>
                </TabTitle>

                <RefContextProvider>
                    <Button
                        className='w-6 h-6 p-1 fill-icon-100'
                        label='Создать роль'
                        onLeftClick={handleCreateRole}
                    >
                        <Icon
                            className='w-full h-full'
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

            <ArrowFocusContextProvider 
                list={tabs} 
                orientation='vertical'
            >
                <TabList 
                    className={styles.listWrapper}
                    label='Список ролей' 
                    orientation='vertical'
                >
                    <div className={styles.list}>
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
                    </div>
                </TabList>
            </ArrowFocusContextProvider>
        </div>
    );
};