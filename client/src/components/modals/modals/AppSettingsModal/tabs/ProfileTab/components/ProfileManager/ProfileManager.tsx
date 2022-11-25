import { Button, UserAvatar, Image, UserStatus } from '@components';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {};

export const ProfileManager: FC<PropsWithClassName> = ({
    className = '',
}) => {
    return (
        <div className='rounded-lg overflow-hidden'>
            <div className='bg-rose-700 h-[100px]'></div>

            <div className='flex flex-col px-4 pb-4 bg-primary-500'>
                <div className='flex mb-4 pt-4 h-[72px] relative'>
                    <div className='rounded-full w-[94px] 
                    aspect-square p-[7px] absolute bottom-0
                    bg-primary-500 '>
                        <div className='relative w-full h-full'>
                            <Image
                                imageClassName='rounded-full'
                                src='https://i.pravatar.cc/52'
                                alt='my avatar'
                            />

                            <div className='absolute w-7 h-7 p-1.5 -bottom-1 -right-1 
                            bg-primary-500 rounded-full'>
                                <UserStatus
                                    className='w-full h-full'
                                    status='online'
                                    extraStatus='default'
                                />
                            </div>
                        </div>
                    </div>
                    
                    <span className='ml-[104px] text-xl text-primary font-medium'>
                        лошок111
                    </span>
                </div>

                <div className='flex flex-col gap-6 p-4 bg-primary-300 rounded-lg'>
                    <div className='flex w-full justify-between gap-4'>
                        <div className='flex flex-col'>
                            <span>Имя пользователя</span>

                            <span>лошок111</span>
                        </div>
                        
                        <div className='flex'>
                            <Button>
                                <>Изменить</>
                            </Button>
                        </div>
                    </div>

                    <div className='flex w-full justify-between gap-4'>
                        <div className='flex flex-col'>
                            <span>Электронная почта</span>

                            <span>***@gmail.com</span>
                        </div>
                        
                        <div className='flex'>
                            <Button>
                                <>Изменить</>
                            </Button>
                        </div>
                    </div>

                    <div className='flex w-full justify-between gap-4'>
                        <div className='flex flex-col'>
                            <span>Пароль</span>

                            <span>****</span>
                        </div>
                        
                        <div className='flex'>
                            <Button>
                                <>Изменить</>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};