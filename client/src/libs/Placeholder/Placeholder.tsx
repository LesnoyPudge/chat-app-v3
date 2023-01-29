import ContentLoader from 'react-content-loader';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { Conditional } from '@components';



interface IPlaceholder extends PropsWithChildrenAndClassName {
    isLoaded?: boolean;
}

export const Placeholder: FC<IPlaceholder> = ({
    className = '',
    isLoaded = false,
    children,
}) => {
    return (
        <>
            <Conditional isRendered={!isLoaded}>
                <div className={twClassNames(className)}>
                    <ContentLoader 
                        className='w-auto h-auto bg-danger'
                        // animate
                        // backgroundColor='#40444B'
                        // foregroundColor='#36393F'
                        
                    >
                        <rect x='0' y='0' rx='5' ry='5' width='70' height='70' />
                        <rect x='80' y='17' rx='4' ry='4' width='300' height='13' />
                        <rect x='80' y='40' rx='3' ry='3' width='250' height='10' />
                    </ContentLoader>
                </div>
            </Conditional>

            <Conditional isRendered={isLoaded}>
                {children}
            </Conditional>
        </>
    );
};