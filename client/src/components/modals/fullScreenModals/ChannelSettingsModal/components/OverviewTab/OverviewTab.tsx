import { ChannelSettingsModalTabs, CheckBoxIndicator, Separator, TabContext, TabPanel } from '@components';
import { FormikCheckBox } from '@libs';
import { Form, Formik } from 'formik';
import { FC, useContext } from 'react';
import { TabTitle } from '../../../components';



const styles = {
    checkBox: 'flex',
    checkBoxText: 'font-medium mr-auto',
};

export const OverviewTab: FC = () => {
    const { tabs } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;
    
    return (
        <Formik
            initialValues={{ isPrivate: false }}
            onSubmit={() => {}}
        >
            <Form>
                <TabPanel
                    label='Обзор канала' 
                    controls={tabs.overviewTab.identifier}
                >
                    <TabTitle>
                        <>Обзор канала</>
                    </TabTitle>

                    <Separator spacing={500}/>

                    {/*  */}

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
            </Form>
        </Formik>
    );
};