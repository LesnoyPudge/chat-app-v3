import { Tooltip, TopBar } from '@components';
import { FC } from 'react';



export const AppPage: FC = () => {
    return (
        <>
            <div className='flex w-full'>
                <div className='flex flex-col bg-primary-300 shrink-0 w-[min(240px,100%)]'>
                    <TopBar>
                        top bar
                    </TopBar>

                    <div className='p-2.5'>
                        PrivateMessages
                    </div>

                    {/* AccountPanel */}
                </div>

                <div className='flex flex-col bg-primary-200 w-full gap-10'>
                    <TopBar>
                        friends | online | offline | ...
                    </TopBar>

                    <Tooltip content='wow' position='top'>
                        <div className='flex w-12 h-12 overflow-hidden border-red-500 border-2'>top</div>
                    </Tooltip>

                    <Tooltip content='wow' position='right'>
                        <div className='flex w-12 h-12 overflow-hidden border-red-500 border-2'>right</div>
                    </Tooltip>

                    <Tooltip content='wow' position='bottom'>
                        <div className='flex w-12 h-12 overflow-hidden border-red-500 border-2'>bottom</div>
                    </Tooltip>

                    <Tooltip content='wow' position='left'>
                        <div className='flex w-12 h-12 overflow-hidden border-red-500 border-2'>left</div>
                    </Tooltip>
                </div>
            </div>
        </>
    );
};
