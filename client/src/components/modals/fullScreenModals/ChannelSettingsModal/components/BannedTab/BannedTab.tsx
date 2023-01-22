import { ChannelSettingsModalTabs, TabContext, TabPanel } from '@components';
import { FC, useContext } from 'react';



export const BannedTab: FC = () => {
    const { tabs } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;

    return (
        <TabPanel 
            label='Забаненные пользователи' 
            controls={tabs.bannedTab.identifier}
        >
            4
        </TabPanel>
    );
};