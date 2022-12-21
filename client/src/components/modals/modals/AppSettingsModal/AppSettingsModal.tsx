import { FC } from 'react';
import { ContentSide, NavigationSide } from './components';
import { Tab, ModalWindow, TabContexProvider } from '@components';
import { AppearanceTab, ProfileTab } from './tabs';
import { getTransitionOptions } from '@utils';



const transitionOptions = getTransitionOptions.fullScreenModal();

const tabs: Tab[] = [
    {
        identifier: 'ProfileTab',
        tab: <ProfileTab/>,
    },
    {
        identifier: 'AppearanceTab',
        tab: <AppearanceTab/>,
    },
];

export const AppSettingsModal: FC = () => {
    return (
        <ModalWindow transitionOptions={transitionOptions}>
            <TabContexProvider tabs={tabs}>
                {({ currentTab }) => (
                    <div className='flex h-screen w-screen bg-primary-200'>
                        <NavigationSide/>
    
                        <ContentSide>
                            {currentTab.tab}
                        </ContentSide>
                    </div>
                )}
            </TabContexProvider>
        </ModalWindow>
    );
};