import { ArrowFocusContextProvider, ArrowFocusItem, Button, ChannelSettingsModalFormValues, TabContext, TabContextProvider, TabList, TabPanel } from '@components';
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
    members: 'Права доступа',
    permissions: 'Управление участниками',
};

const tabNames: Record<keyof RoleContentTabs, string> = {
    appearance: 'Отображение',
    members: 'Права доступа',
    permissions: 'Участники',
};

const styles = {
    wrapper: 'w-full py-[60px] pl-6 pr-10',
    title: 'font-semibold text-color-primary uppercase mb-6',
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
    const { currentTab } = useContext(TabContext) as TabContext<Record<string, string>>;
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
        <TabContextProvider tabs={providedTabs} initialTab='permissions'>
            {({ currentTab, tabs, changeTab, isActive }) => (
                <HeadingLevel>
                    <TabPanel
                        className={styles.wrapper}
                        label={`Редактировать роль: ${currentTab.tab}`} 
                        controls={currentTab.identifier}
                    >
                        <Heading className={styles.title}>
                            <>Редактировать роль — {role.name}</>
                        </Heading>

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

                                {Object.keys(tabs).map((tab) => {
                                    const label = labels[tab as keyof RoleContentTabs];
                                    const tabName = tabNames[tab as keyof RoleContentTabs];
                                    const isTabActive = isActive[tab as keyof RoleContentTabs];
                                    const handleNavigate = changeTab[tab as keyof RoleContentTabs];

                                    return (
                                        <ArrowFocusItem id={tab} key={tab}>
                                            {({ tabIndex }) => (
                                                <Button
                                                    className={twClassNames(
                                                        styles.button.base,
                                                        { [styles.button.active]: isTabActive },
                                                    )}
                                                    label={label}
                                                    role='tab'
                                                    controls={tab}
                                                    tabIndex={tabIndex}
                                                    onLeftClick={handleNavigate}
                                                >
                                                    <>{tabName}</>
                                                </Button>
                                            )}
                                        </ArrowFocusItem>
                                    );
                                })}
                            </TabList>
                        </ArrowFocusContextProvider>

                        {currentTab.tab}
                    </TabPanel>
                </HeadingLevel>
            )}
        </TabContextProvider>
    );
};