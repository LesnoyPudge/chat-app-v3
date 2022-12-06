import { Button } from '@components';
import { FC } from 'react';



const styles = {
    content: 'flex flex-col gap-6 p-4 bg-primary-300 rounded-lg',
};

export const Content: FC = () => {
    return (
        <ul className={styles.content}>
            <li className='flex w-full justify-between gap-4'>
                <div className='flex flex-col'>
                    <span className='font-bold uppercase text-xs text-secondary mb-1'>
                        <>Имя пользователя</>
                    </span>

                    <span className='text-primary'>
                        <>лошок111</>
                    </span>
                </div>
    
                <Button 
                    className='h-8 my-auto'
                    variant='brand'
                >
                    <>Изменить</>
                </Button>
            </li>
        </ul>
    );
};

{/* <li className='flex w-full justify-between gap-4'>
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
            </li>

            <li className='flex w-full justify-between gap-4'>
                <div className='flex flex-col'>
                    <span>Пароль</span>

                    <span>********</span>
                </div>
    
                <div className='flex'>
                    <Button>
                        <>Изменить</>
                    </Button>
                </div>
            </li> */}