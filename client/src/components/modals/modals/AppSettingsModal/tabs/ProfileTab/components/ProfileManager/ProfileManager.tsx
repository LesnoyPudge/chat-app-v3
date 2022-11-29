import { Button, Icon, Image, RefContextProvider, Tooltip, UserStatus } from '@components';
import { useFiles } from '@hooks';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { SettingsGroup, SettingsGroupTitle } from '../../../components';
import { Banner } from './components';



const styles = {
    wrapper: 'flex flex-col',
};

export const ProfileManager: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { open, onChange } = useFiles({ multiple: true });

    onChange((files) => {
        console.log(files);
    });

    return (
        <SettingsGroup>
            <div className={twClassNames(styles.wrapper, className)}>
                <Banner/>

                <div className='flex flex-col px-4 pb-4 bg-primary-500 rounded-b-lg'>
                    <div className='flex mb-4 pt-4 h-[72px] relative'>
                        <div className='rounded-full w-[94px] 
                    aspect-square p-[7px] absolute bottom-0
                    bg-primary-500 '>
                            <Button
                                className='relative w-full h-full rounded-full cursor-pointer group'
                                isntStyled
                                onClick={open}
                            >
                                <Image
                                    wrapperClassName='w-full h-full rounded-full'
                                    src='https://i.pravatar.cc/52'
                                    alt='my avatar'
                                />

                                <div className='grid place-items-center absolute w-full 
                                h-full opacity-0 group-hover:opacity-100 
                                group-focus-visible:opacity-100 bg-sky-500 
                                top-0 left-0 rounded-full'>
                                    <span className='text-xxs font-bold uppercase w-min text-center'>
                                        <>Изменить аватар</>
                                    </span>
                                </div>

                                <div className='absolute w-7 h-7 p-1.5 -bottom-1 -right-1 
                                bg-primary-500 rounded-full'>
                                    <UserStatus
                                        className='w-full h-full'
                                        status='online'
                                        extraStatus='default'
                                    />
                                </div>
                            </Button>
                        </div>
                    
                        <span className='ml-[104px] text-xl text-primary font-medium'>
                            <>лошок111</>
                        </span>
                    </div>

                    <div className='flex flex-col gap-6 p-4 bg-primary-300 rounded-lg'>
                        <div className='flex w-full justify-between gap-4'>
                            <div className='flex flex-col'>
                                <span>Имя пользователя</span>

                                <span>лошок111</span>
                            </div>
                        
                            <div className='flex'>
                                <Button variant='brand'>
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
                                    <>Активировать</>
                                </Button>

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
        </SettingsGroup>
    );
};