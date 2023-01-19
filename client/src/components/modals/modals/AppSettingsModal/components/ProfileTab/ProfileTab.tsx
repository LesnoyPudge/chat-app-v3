import { FC } from 'react';
import { Button, DeleteAccountModal, OverlayContextProvider, Separator } from '@components';
import { ProfileManager } from './components';
import { HeadingLevel } from '@libs';
import { SectionTitle, SettingsDescription, SettingsGroupTitle } from '..';



export const ProfileTab: FC = () => {
    return (
        <HeadingLevel>
            <div>
                <SectionTitle className='mb-5'>
                    <>Моя учётная запись</>
                </SectionTitle>

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
            </div>
        </HeadingLevel>
    );
};