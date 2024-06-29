import { FC, useContext } from 'react';
import { AppSettingsModalTabs, Button, DeleteAccountModal, OverlayContextProvider, Separator, TabContext, TabPanel } from '@components';
import { ProfileManager } from './components';
import { HeadingLevel } from '@libs';
import { SettingsDescription, SettingsGroupTitle } from '..';
import { TabTitle } from '../../../components';



export const ProfileTab: FC = () => {
    const { tabPanelProps } = useContext<TabContext<AppSettingsModalTabs>>(TabContext);

    return (
        <HeadingLevel>
            <TabPanel {...tabPanelProps.profileTab}>
                <TabTitle>
                    <>Моя учётная запись</>
                </TabTitle>

                <ProfileManager/>

                <Separator spacing={40}/>

                <HeadingLevel>
                    <SettingsGroupTitle className='mb-2'>
                        <>Удаление учётной записи</>
                    </SettingsGroupTitle>

                    <SettingsDescription className='mb-4'>
                        <>Удалив учётную запись, вы не сможете восстановить её.</>
                    </SettingsDescription>

                    <OverlayContextProvider>
                        {({ openOverlay, isOverlayExist }) => (
                            <>
                                <Button
                                    stylingPreset='brandDanger'
                                    hasPopup='dialog'
                                    isActive={isOverlayExist}
                                    onLeftClick={openOverlay}
                                >
                                    <>Удалить учётную запись</>
                                </Button>

                                <DeleteAccountModal/>
                            </>
                        )}
                    </OverlayContextProvider>
                </HeadingLevel>
            </TabPanel>
        </HeadingLevel>
    );
};