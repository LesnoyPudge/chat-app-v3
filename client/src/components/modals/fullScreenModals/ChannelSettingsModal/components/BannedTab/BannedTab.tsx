import { ChannelSettingsModalTabs, TabContext, TabPanel } from '@components';
import { FC, useContext } from 'react';



const styles = {
    wrapper: 'ml-10 mt-[60px]',
};

export const BannedTab: FC = () => {
    const { tabPanelProps } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;

    return (
        <TabPanel 
            className={styles.wrapper}
            {...tabPanelProps.bannedTab}
        >
            4
        </TabPanel>
    );
};