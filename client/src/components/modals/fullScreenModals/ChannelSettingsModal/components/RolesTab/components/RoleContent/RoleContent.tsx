import { AddMemberToRoleModal, Button, ChannelSettingsModalFormValues, DeleteRoleModal,SpriteImage, List, OverlayContextProvider, Ref, SearchBar, TabContext, TabContextProvider, TabList, TabPanel, Tooltip , MoveFocusInside } from '@components';
import { useKeyboardNavigation, useRefWithSetter, useTextInput } from '@hooks';
import { HeadingLevel, Heading } from '@libs';
import { ObjectWithId } from '@types';
import { objectKeys, objectKeysToIdArray, twClassNames } from '@utils';
import { useFormikContext } from 'formik';
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
    membersSearchWrapper: 'flex gap-4 mb-7',
    membersSearch: 'h-8',
};

export const RoleContent: FC = () => {
    const { currentTab, tabPanelProps } = useContext<TabContext<Record<string, string>>>(TabContext);
    const { values, resetForm } = useFormikContext<ChannelSettingsModalFormValues>();
    const permissionsSearch = useTextInput();
    const membersSearch = useTextInput();

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
        permissions: <RolePermissionsTab value={permissionsSearch.value}/>,
        members: <RoleMembersTab value={membersSearch.value}/>,
    };

    const [rolesRef, setRolesRef] = useRefWithSetter<ObjectWithId[]>([]);
    const {
        getTabIndex,
        setRoot,
        withFocusSet,
        getIsFocused,
    } = useKeyboardNavigation(rolesRef);

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
                    {({ currentTab, tabs, changeTab, isActive, tabProps }) => {
                        setRolesRef(objectKeysToIdArray(tabs));

                        return (
                            <>
                                <div className={styles.header}>
                                    <div className={styles.description}>
                                        <Heading className={styles.title}>
                                            <>Редактировать роль — {role.name}</>
                                        </Heading>

                                        <OverlayContextProvider>
                                            {({ isOverlayExist, openOverlay }) => (
                                                <Ref<HTMLButtonElement>>
                                                    {(ref) => (
                                                        <>
                                                            <Button
                                                                className={styles.deleteRoleButton}
                                                                label={`Удалить роль ${role.name}`}
                                                                hasPopup='dialog'
                                                                isActive={isOverlayExist}
                                                                innerRef={ref}
                                                                onLeftClick={openOverlay}
                                                            >
                                                                <SpriteImage
                                                                    className={styles.deleteRoleIcon}
                                                                    name='GARBAGE_CAN_ICON'
                                                                />
                                                            </Button>

                                                            <Tooltip
                                                                preferredAlignment='top'
                                                                spacing={8}
                                                                boundsSize={0}
                                                                leaderElementRef={ref}
                                                            >
                                                                <>Удалить роль</>
                                                            </Tooltip>

                                                            <DeleteRoleModal roleId={role.id}/>
                                                        </>
                                                    )}
                                                </Ref>
                                            )}
                                        </OverlayContextProvider>
                                    </div>

                                    <TabList
                                        className={styles.tabList}
                                        label='Настройки роли'
                                        orientation='horizontal'
                                        tabIndex={0}
                                        innerRef={setRoot}
                                    >
                                        <div className={styles.headerDivider}></div>

                                        <List list={Object.keys(tabs)}>
                                            {(tab) => (
                                                <MoveFocusInside enabled={getIsFocused(tab)}>
                                                    <Button
                                                        className={twClassNames(
                                                            styles.button.base,
                                                            { [styles.button.active]: isActive[tab] },
                                                        )}
                                                        label={labels[tab]}
                                                        tabIndex={getTabIndex(tab)}
                                                        {...tabProps[tab]}
                                                        onLeftClick={withFocusSet(tab, changeTab[tab])}
                                                    >
                                                        {tabNames[tab]}
                                                    </Button>
                                                </MoveFocusInside>
                                            )}
                                        </List>
                                    </TabList>

                                    <If condition={isActive.permissions}>
                                        <SearchBar
                                            className={styles.permissionsSearchBar}
                                            value={permissionsSearch.value}
                                            label='Поиск по правам'
                                            placeholder='Поиск по правам'
                                            onChange={permissionsSearch.handleChange}
                                            onReset={permissionsSearch.handleReset}
                                        />
                                    </If>

                                    <If condition={isActive.members}>
                                        <div className={styles.membersSearchWrapper}>
                                            <SearchBar
                                                className={styles.membersSearch}
                                                value={membersSearch.value}
                                                label='Поиск участников'
                                                placeholder='Поиск участников'
                                                onChange={membersSearch.handleChange}
                                                onReset={membersSearch.handleReset}
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
                                    </If>
                                </div>

                                {providedTabs[currentTab.identifier]}
                            </>
                        );
                    }}
                </TabContextProvider>
            </TabPanel>
        </HeadingLevel>
    );
};