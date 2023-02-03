import { ArrowFocusContextProvider, ArrowFocusItem, Button, ChannelSettingsModalFormValues, DeleteRoleModal, Icon, OverlayContextProvider, RefContextProvider, TabContext, TabContextProvider, TabList, TabPanel, Tooltip } from '@components';
import { HeadingLevel, Heading } from '@libs';
import { twClassNames } from '@utils';
import { FormikContextType, useFormikContext } from 'formik';
import { FC, useContext, useEffect } from 'react';
import { RoleMembersTab, RoleAppearanceTab, RolePermissionsTab } from './components';



export type RoleContentTabs = typeof providedTabs;

const providedTabs = {
    appearance: <RoleAppearanceTab/>,
    permissions: <RolePermissionsTab/>,
    members: <RoleMembersTab/>,
};

const labels: Record<keyof RoleContentTabs, string> = {
    appearance: 'Элементы отображения',
    members: 'Управление участниками',
    permissions: 'Права доступа',
};

const tabNames: Record<keyof RoleContentTabs, string> = {
    appearance: 'Отображение',
    members: 'Участники',
    permissions: 'Права доступа',
};

const styles = {
    wrapper: 'flex flex-col w-full pt-[60px] pl-6 pr-10',
    title: 'font-semibold text-color-primary uppercase truncate',
    header: 'flex justify-between gap-2 relative mb-8',
    headerDivider: 'absolute w-full bottom-0 h-0.5 bg-primary-100',
    button: {
        base: `pb-4 relative border-b-2 border-transparent 
        font-medium text-color-secondary
        hover:border-icon-200 focus-visible:border-icon-200
        hover:text-color-primary focus-visible:text-color-primary`,
        active: 'text-color-primary border-icon-200',
    },
};

export const RoleContent: FC = () => {
    const { currentTab, tabPanelProps } = useContext(TabContext) as TabContext<Record<string, string>>;
    const { values, resetForm } = useFormikContext() as FormikContextType<ChannelSettingsModalFormValues>;

    const roles = Array(32).fill('').map((_, index) => ({
        id: index.toString(),
        name: `role${index}`,
        color: '#fff',
    }));
    const normalizedRoles: Record<string, {id: string, name: string, color: string}> = {};
    roles.forEach((role) => normalizedRoles[role.id] = role);
    const role = normalizedRoles[currentTab.identifier];

    useEffect(() => {
        if (values.roleId === role.id) return;

        resetForm({
            values: {
                ...values,
                roleId: role.id,
                roleColorHEX: role.color,
                roleName: role.name,
            },
        });
    }, [resetForm, role, values]);

    return (
        <HeadingLevel>
            <TabPanel
                className={styles.wrapper}
                {...tabPanelProps[currentTab.identifier]}
            >
                <div className='flex items-center justify-between gap-2 mb-6'>
                    <Heading className={styles.title}>
                        <>Редактировать роль — {role.name}</>
                    </Heading>

                    <OverlayContextProvider>
                        {({ isOverlayExist, openOverlay }) => (
                            <RefContextProvider>
                                <Button
                                    className='w-8 h-8 p-1.5 fill-icon-100 hover:fill-danger focus-visible:fill-danger'
                                    label={`Удалить роль ${role.name}`}
                                    hasPopup='dialog'
                                    isActive={isOverlayExist}
                                    onLeftClick={openOverlay}
                                >
                                    <Icon
                                        className='w-full h-full'
                                        iconId='garbage-can-icon'
                                    />
                                </Button>
    
                                <Tooltip 
                                    preferredAligment='top'
                                    spacing={8}
                                    boundsSize={0}
                                >
                                    <>Удалить роль</>
                                </Tooltip>

                                <DeleteRoleModal roleId={role.id}/>
                            </RefContextProvider>
                        )}
                    </OverlayContextProvider>
                </div>
                        
                <TabContextProvider tabs={providedTabs} initialTab='members'>
                    {({ currentTab, tabs, changeTab, isActive, tabProps }) => (
                        <>
                            <ArrowFocusContextProvider 
                                list={tabs} 
                                orientation='horizontal'
                            >
                                <TabList 
                                    className={styles.header}
                                    label='Настройки роли' 
                                    orientation='horizontal'
                                >
                                    <div className={styles.headerDivider}></div>

                                    {(Object.keys(tabs) as Array<keyof typeof tabs>).map((tab) => (
                                        <ArrowFocusItem id={tab} key={tab}>
                                            {({ tabIndex }) => (
                                                <Button
                                                    className={twClassNames(
                                                        styles.button.base,
                                                        { [styles.button.active]: isActive[tab] },
                                                    )}
                                                    label={labels[tab]}
                                                    tabIndex={tabIndex}
                                                    {...tabProps[tab]}
                                                    onLeftClick={changeTab[tab]}
                                                >
                                                    {tabNames[tab]}
                                                </Button>
                                            )}
                                        </ArrowFocusItem>
                                    ))}
                                </TabList>
                            </ArrowFocusContextProvider>

                            {currentTab.tab}
                        </>
                    )}
                </TabContextProvider>
            </TabPanel>
        </HeadingLevel>
    );
};