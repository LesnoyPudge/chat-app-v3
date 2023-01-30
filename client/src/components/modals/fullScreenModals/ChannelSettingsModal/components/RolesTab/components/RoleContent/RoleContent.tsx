import { Heading, HeadingLevel } from '@libs';
import { FC } from 'react';
import { ArrowFocusContextProvider, ArrowFocusItem, Button, TabContextProvider, TabList } from '@components';
import { twClassNames } from '@utils';
import { RoleAppearanceTab, RoleMembersTab, RolePermissionsTab } from './components';



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
    const roleName = 'новая роль';

    return (
        <HeadingLevel>
            <div className={styles.wrapper}>
                <Heading className={styles.title}>
                    <>Редактировать роль — {roleName}</>
                </Heading>

                <TabContextProvider tabs={providedTabs}>
                    {({ currentTab, tabs, changeTab, isActive }) => (
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
                        </>
                    )}
                </TabContextProvider>
            </div>
        </HeadingLevel>
    );
};