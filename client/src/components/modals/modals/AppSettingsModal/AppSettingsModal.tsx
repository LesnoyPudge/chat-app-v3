import { FC } from 'react';
import { Modal } from '../../components';
import { UseTransitionProps } from '@react-spring/web';
import { ContentSide, NavigationSide } from './components';
import { ITab, TabContexProvider } from '@components';



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
};

const tabs: ITab[] = [
    {
        identifier: '1',
        tab: 'wow',
    },
    {
        identifier: '2',
        tab: 'amazing',
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