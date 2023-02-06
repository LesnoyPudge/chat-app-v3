import { AddMemberToRoleModal, ArrowFocusContextProvider, ArrowFocusItem, Button, ChannelSettingsModalFormValues, Conditional, DeleteRoleModal, Icon, OverlayContextProvider, RefContextProvider, SearchBar, TabContext, TabContextProvider, TabList, TabPanel, Tooltip } from '@components';
import { useSearch } from '@hooks';
import { HeadingLevel, Heading } from '@libs';
import { objectKeys, twClassNames } from '@utils';
import { FormikContextType, useFormikContext } from 'formik';
import { FC, useContext, useEffect } from 'react';
import { RoleMembersTab, RoleAppearanceTab, RolePermissionsTab } from './components';



type tabKeys = 'appearance' | 'permissions' | 'members'

export type RoleContentTabs = Record<tabKeys, JSX.Element>

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
    wrapper: 'flex flex-col pl-[24px] w-full',
    header: 'sticky top-0 pt-[60px] z-10 bg-primary-200',
    description: 'flex items-center justify-between gap-2 mb-6',
    title: 'font-semibold text-color-primary uppercase truncate',
    deleteRoleButton: 'w-8 h-8 p-1.5 fill-icon-100 hover:fill-danger focus-visible:fill-danger',
    deleteRoleIcon: 'w-full h-full',
    tabList: 'flex justify-between gap-2 relative mb-4',
    headerDivider: 'absolute w-full bottom-0 h-0.5 bg-primary-100',
    button: {
        base: `pb-4 relative border-b-2 border-transparent 
        font-medium text-color-secondary
        hover:border-icon-200 focus-visible:border-icon-200
        hover:text-color-primary focus-visible:text-color-primary`,
        active: 'text-color-primary border-icon-200',
    },
    permissionsSearchBar: 'h-9 mb-4',
    memberssSearchWrapper: 'flex gap-4 mb-7',
    memberssSearch: 'h-8',
};

export const RoleContent: FC = () => {
    const { currentTab, tabPanelProps } = useContext(TabContext) as TabContext<Record<string, string>>;
    const { values, resetForm } = useFormikContext() as FormikContextType<ChannelSettingsModalFormValues>;
    const permissionsSearch = useSearch();
    const memberssSearch = useSearch();

    const roles = Array(32).fill('').map((_, index) => ({
        id: index.toString(),
        name: `role${index}`,
        color: '#fff',
    }));
    const normalizedRoles: Record<string, {id: string, name: string, color: string}> = {};
    roles.forEach((role) => normalizedRoles[role.id] = role);
    const role = normalizedRoles[currentTab.identifier];

    const providedTabs: RoleContentTabs = {
        appearance: <RoleAppearanceTab/>,
        permissions: <RolePermissionsTab searchValue={permissionsSearch.searchValue}/>,
        members: <RoleMembersTab searchValue={memberssSearch.searchValue}/>,
    };

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
                <TabContextProvider tabs={providedTabs}>
                    {({ currentTab, tabs, changeTab, isActive, tabProps }) => (
                        <>
                            <div className={styles.header}>
                                <div className={styles.description}>
                                    <Heading className={styles.title}>
                                        <>Редактировать роль — {role.name}</>
                                    </Heading>

                                    <OverlayContextProvider>
                                        {({ isOverlayExist, openOverlay }) => (
                                            <RefContextProvider>
                                                <Button
                                                    className={styles.deleteRoleButton}
                                                    label={`Удалить роль ${role.name}`}
                                                    hasPopup='dialog'
                                                    isActive={isOverlayExist}
                                                    onLeftClick={openOverlay}
                                                >
                                                    <Icon
                                                        className={styles.deleteRoleIcon}
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
                        
                                <ArrowFocusContextProvider 
                                    list={tabs} 
                                    orientation='horizontal'
                                >
                                    <TabList 
                                        className={styles.tabList}
                                        label='Настройки роли' 
                                        orientation='horizontal'
                                    >
                                        <div className={styles.headerDivider}></div>

                                        {objectKeys(tabs).map((tab) => (
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
                            
                                <Conditional isRendered={isActive.permissions}>
                                    <SearchBar
                                        className={styles.permissionsSearchBar}
                                        value={permissionsSearch.searchValue}
                                        label='Поиск по правам'
                                        placeholder='Поиск по правам'
                                        onChange={permissionsSearch.handleChange}
                                        onReset={permissionsSearch.handleReset}
                                    />
                                </Conditional>

                                <Conditional isRendered={isActive.members}>
                                    <div className={styles.memberssSearchWrapper}>
                                        <SearchBar
                                            className={styles.memberssSearch}
                                            value={memberssSearch.searchValue}
                                            label='Поиск участников'
                                            placeholder='Поиск участников'
                                            onChange={memberssSearch.handleChange}
                                            onReset={memberssSearch.handleReset}
                                        />
                                    
                                        <OverlayContextProvider>
                                            {({ isOverlayExist, openOverlay }) => (
                                                <>
                                                    <Button
                                                        stylingPreset='brand'
                                                        size='small'
                                                        hasPopup='dialog'
                                                        isActive={isOverlayExist}
                                                        onLeftClick={openOverlay}
                                                    >
                                                        <>Добавить участников</>
                                                    </Button>

                                                    <AddMemberToRoleModal roleId={values.roleId}/>
                                                </>
                                            )}
                                        </OverlayContextProvider>
                                    </div>
                                </Conditional>
                            </div>

                            {currentTab.tab}
                        </>
                    )}
                </TabContextProvider>
            </TabPanel>
        </HeadingLevel>
    );
};