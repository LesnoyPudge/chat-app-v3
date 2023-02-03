import { ChannelSettingsModalTabs, TabContext, TabPanel } from '@components';
import { FC, useContext } from 'react';



export const BannedTab: FC = () => {
    const { tabPanelProps } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;

    return (
        <TabPanel {...tabPanelProps.bannedTab}>
            4
        </TabPanel>
    );
};