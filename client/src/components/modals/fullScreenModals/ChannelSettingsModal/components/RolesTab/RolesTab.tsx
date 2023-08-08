import { ChannelSettingsModalFormValues, ChannelSettingsModalTabs, TabContext, TabContextProvider, TabPanel } from '@components';
import { useFormikContext } from 'formik';
import { FC, useContext } from 'react';
import { ScreenShakeContext } from '../../../components';
import { RoleContent, RoleNavigation } from './components';



const styles = {
    wrapper: 'flex',
};

const roles = Array(32).fill('').map((_, index) => ({
    id: index.toString(),
    name: `role${index}`,
    color: 'rgb(34 197 94)',
}));

export const RolesTab: FC = () => {
    const { tabPanelProps } = useContext<TabContext<ChannelSettingsModalTabs>>(TabContext);
    const { dirty } = useFormikContext<ChannelSettingsModalFormValues>();
    const { triggerScreenShake } = useContext(ScreenShakeContext);

    const rolesTabs: Record<string, string> = {};
    roles.forEach((role) => rolesTabs[role.id] = role.name);

    const navigateToRoleTab = () => {
        if (dirty) triggerScreenShake();
        return !dirty;
    };

    return (
        <TabPanel
            className={styles.wrapper}
            {...tabPanelProps.rolesTab}
        >
            <TabContextProvider
                tabs={rolesTabs}
                onTabChange={navigateToRoleTab}
            >
                <RoleNavigation/>

                <RoleContent/>
            </TabContextProvider>
        </TabPanel>
    );
};