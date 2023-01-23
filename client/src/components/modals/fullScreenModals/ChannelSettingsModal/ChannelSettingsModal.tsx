import { FC } from 'react';
import { Button, ModalWindow, TabContextProvider } from '@components';
import { getTransitionOptions } from '@utils';
import { FullScreenModalWrapper, FullScreenModalNavigationSide, FullScreenModalContentSide } from '../components';
import { BannedTab, MembersTab, Navigation, OverviewTab, RolesTab } from './components';



export type ChannelSettingsModalTabs = typeof tabs;

const transitionOptions = getTransitionOptions.fullScreenModal();

const tabs = {
    overviewTab: <OverviewTab/>,
    rolesTab: <RolesTab/>,
    membersTab: <MembersTab/>,
    bannedTab: <BannedTab/>,
};

export const ChannelSettingsModal: FC = () => {
    return (
        <ModalWindow 
            label='Настройки канала' 
            transitionOptions={transitionOptions}
        >
            <TabContextProvider tabs={tabs}>
                {({ currentTab }) => (
                    <FullScreenModalWrapper>
                        <FullScreenModalNavigationSide>
                            <Navigation/>
                        </FullScreenModalNavigationSide>
    
                        <FullScreenModalContentSide>
                            {currentTab.tab}
                            
                            <div className='absolute max-w-[740px] px-5 pb-5 left-0 right-0 bottom-0 pointer-events-none'>
                                <div className='flex w-full items-center gap-2.5 p-2.5 rounded-md bg-primary-500 pointer-events-auto'>
                                    <div className='font-medium truncate mr-auto'>
                                        <>Аккуратнее, вы не сохранили изменения!</>
                                    </div>

                                    <Button
                                        stylingPreset='lite'
                                        size='small'
                                        type='reset'
                                    >
                                        <>Сброс</>
                                    </Button>

                                    <Button
                                        stylingPreset='brandPositive'
                                        size='small'
                                        type='submit'
                                    >
                                        <>Сохранить изменения</>
                                    </Button>
                                </div>
                            </div>
                        </FullScreenModalContentSide>
                    </FullScreenModalWrapper>
                )}
            </TabContextProvider>
        </ModalWindow>
    );
};