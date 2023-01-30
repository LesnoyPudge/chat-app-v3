import { ChannelSettingsModalTabs, TabContext, TabPanel } from '@components';
import { FC, useContext } from 'react';
import { RoleContent, RoleNavigation } from './components';



const styles = {
    wrapper: 'flex absolute inset-0 max-w-[calc(740px+56px)] pr-[56px]',
};

export const RolesTab: FC = () => {
    const { tabs } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;

    return (
        <TabPanel
            className={styles.wrapper}
            label='Роли канала' 
            controls={tabs.rolesTab.identifier}
        >
            <RoleNavigation/>

            <RoleContent/>
        </TabPanel>
    );
};