import { ChannelSettingsModalTabs, CheckBoxIndicator, Separator, TabContext, TabPanel } from '@components';
import { FormikCheckBox } from '@libs';
import { FC, useContext } from 'react';
import { TabTitle } from '../../../components';



const styles = {
    checkBox: 'flex gap-2',
    checkBoxText: 'font-medium mr-auto',
};

export const OverviewTab: FC = () => {
    const { tabs } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;
    
    return (
        <TabPanel
            label='Обзор канала' 
            controls={tabs.overviewTab.identifier}
        >
            <TabTitle>
                <>Обзор канала</>
            </TabTitle>

            <Separator spacing={40}/>

            <FormikCheckBox 
                className={styles.checkBox}
                label='Приватность канала' 
                name='isPrivate'
            >
                {({ checked }) => (
                    <>
                        <div className={styles.checkBoxText}>
                            <>Не отображать канал в поиске, вход только по приглашениям.</>
                        </div>

                        <CheckBoxIndicator checked={checked}/>
                    </>
                )}
            </FormikCheckBox>
        </TabPanel>
    );
};