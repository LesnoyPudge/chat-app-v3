import { FC } from 'react';
import { Button, DeleteAccountModal, OverlayContextProvider, Separator } from '@components';
import { Section, SectionTitle, SettingsDescription, SettingsGroup, SettingsGroupTitle } from '../components';
import { ProfileManager } from './components';



export const ProfileTab: FC = () => {
    return (
        <Section>
            <SectionTitle className='mb-5'>
                <>Моя учётная запись</>
            </SectionTitle>

            <ProfileManager/>

            <Separator spacing={40}/><Separator spacing={40}/><Separator spacing={40}/><Separator spacing={40}/><Separator spacing={40}/><Separator spacing={40}/><Separator spacing={40}/><Separator spacing={40}/><Separator spacing={40}/><Separator spacing={40}/><Separator spacing={40}/>

            <SettingsGroup>
                <SettingsGroupTitle className='mb-2'>
                    <>Удаление учётной записи</>
                </SettingsGroupTitle>

                <SettingsDescription className='mb-4'>
                    <>Удалив учётную запись, вы не сможете восстановить её.</>
                </SettingsDescription>

                <OverlayContextProvider>
                    {({ openOverlay }) => (
                        <>
                            <Button
                                className='bg-rose-600 hover:bg-rose-800 
                                focus-visible:bg-rose-800 h-8 flex shrink-0 
                                justify-center items-center px-4 rounded
                                text-white text-sm transition-all font-medium'
                                onLeftClick={openOverlay}
                            >
                                <>Удалить учётную запись</>
                            </Button>

                            <DeleteAccountModal/>
                        </>
                    )}
                </OverlayContextProvider>
            </SettingsGroup>
        </Section>
    );
};