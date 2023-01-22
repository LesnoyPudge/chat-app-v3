import { ChannelSettingsModalTabs, TabContext, TabPanel } from '@components';
import { FC, useContext } from 'react';



export const MembersTab: FC = () => {
    const { tabs } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;

    return (
        <TabPanel 
            label='Участники канала канала' 
            controls={tabs.membersTab.identifier}
        >
            3
        </TabPanel>
    );
};