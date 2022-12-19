import { FC } from 'react';
import { UseTransitionProps } from '@react-spring/web';
import { ContentSide, NavigationSide } from './components';
import { Tab, ModalWindow, TabContexProvider } from '@components';
import { AppearanceTab, ProfileTab } from './tabs';



const transitionOptions: UseTransitionProps = {
    from: {
        opacity: 0,
        scale: 1.2,
    },
    enter: {
        opacity: 1,
        scale: 1,
    },
    leave: {
        opacity: 0,
        scale: 1.2,
    },
    config: {
        duration: 200,
    },
};

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