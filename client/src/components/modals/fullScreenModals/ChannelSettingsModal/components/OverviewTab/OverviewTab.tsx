import { ChannelSettingsModalTabs, TabContext, TabPanel } from '@components';
import { FC, useContext } from 'react';



export const OverviewTab: FC = () => {
    const { tabs } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;
    
    return (
        <TabPanel 
            label='Обзор канала' 
            controls={tabs.overviewTab.identifier}
        >
            1
        </TabPanel>
    );
};