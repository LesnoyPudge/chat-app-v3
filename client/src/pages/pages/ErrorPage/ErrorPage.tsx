import { FC } from 'react'; 
import errorBgImage from '@assets/error-boundary-bg.svg';
import errorImage from '@assets/error-boundary-image.svg';
import { Button } from '@components';
import { FallbackProps } from 'react-error-boundary';



export const ErrorPage: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div className='h-screen w-screen isolate bg-primary-300 text-normal flex'>
            <img 
                className='custom-image-bg-fullscreen'
                src={errorBgImage}
            />

            <div className='flex flex-col m-auto items-center'>
                <img
                    className='mb-5' 
                    src={errorImage}
                />

                <h4 className='text-heading_l text-primary mb-3 font-semibold'>
                    Как-то неловко получается
                </h4>

                <div className='text-muted mb-6 text-center'>
                    <p>В приложении возник неожиданный сбой....</p>

                    <p>Мы отследили ошибку и вскоре ей займёмся.</p>
                </div>

                <Button
                    className='font-semibold h-11'
                    variant='brand'
                    onClick={resetErrorBoundary}
                >
                    Перезагрузить
                </Button>
            </div>
        </div>
    );
};