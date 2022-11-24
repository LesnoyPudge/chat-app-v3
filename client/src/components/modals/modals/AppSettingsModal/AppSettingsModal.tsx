import { FC } from 'react';
import { Modal } from '../../components';
import { UseTransitionProps } from '@react-spring/web';
import { ContentSide, NavigationSide } from './components';
import { ITab, TabContexProvider } from '@components';
import { AppearanceTab, ProfileTab } from './tabs';



const animationProps: UseTransitionProps = {
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

const tabs: ITab[] = [
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
        <Modal 
            className='p-0'
            withoutBackdrop
            animationProps={animationProps}
        >
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
        </Modal>
    );
};