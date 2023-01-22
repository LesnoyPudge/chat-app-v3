import { ChannelSettingsModalTabs, TabContext, TabPanel } from '@components';
import { FC, useContext } from 'react';



export const RolesTab: FC = () => {
    const { tabs } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;

    return (
        <TabPanel 
            label='Роли канала' 
            controls={tabs.rolesTab.identifier}
        >
            2
        </TabPanel>
    );
};