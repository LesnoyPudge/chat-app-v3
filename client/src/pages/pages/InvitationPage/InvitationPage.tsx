import { Button, Image } from '@components';
import { IMAGES } from '@generated';
import { Heading } from '@libs';
import { FC } from 'react';



export const InvitationPage: FC = () => {
    const channel = {
        name: 'amazing channel',
        membersCount: 3228,
        onlineCount: 1337,
    };

    const handleAcceptInvitation = () => {
        console.log('click accept');
    };

    return (
        <div className='flex h-dvh isolate'>
            <Image
                className='image-bg-fullscreen'
                src={IMAGES.COMMON.FANCY_BG.PATH}
            />

            <div className='flex flex-col items-center text-center p-8 max-[480px]:px-4 m-auto w-[480px] rounded bg-primary-200 shadow-elevation-high'>
                <Image
                    className='size-20 rounded-full'
                    src='https://i.pravatar.cc/80'
                />

                <div className='flex flex-col mt-4'>
                    <Heading className='font-semibold text-2xl text-color-primary'>
                        {channel.name}
                    </Heading>

                    <div className='flex flex-wrap justify-center gap-3 mt-2 text-color-muted'>
                        <div className='flex gap-1 items-center'>
                            <div className='w-2.5 h-2.5 bg-positive rounded-full'></div>

                            <span>
                                <>{channel.onlineCount} в сети</>
                            </span>
                        </div>

                        <div className='flex gap-1 items-center'>
                            <div className='w-2.5 h-2.5 bg-icon-200 rounded-full'></div>

                            <span>
                                <>{channel.membersCount} участников</>
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    className='w-full mt-8'
                    size='big'
                    stylingPreset='brand'
                    onLeftClick={handleAcceptInvitation}
                >
                    <>Принять приглашение</>
                </Button>
            </div>
        </div>
    );
};