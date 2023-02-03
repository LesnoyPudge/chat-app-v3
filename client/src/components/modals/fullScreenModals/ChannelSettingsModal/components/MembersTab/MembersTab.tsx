import { ChannelSettingsModalTabs, TabContext, TabPanel } from '@components';
import { FC, useContext } from 'react';



export const MembersTab: FC = () => {
    const { tabPanelProps } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;

    return (
        <TabPanel {...tabPanelProps.membersTab}>
            3
        </TabPanel>
    );
};