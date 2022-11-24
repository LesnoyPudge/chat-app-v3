import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';



const styles = {};

export const ProfileManager: FC<PropsWithClassName> = ({
    className = '',
}) => {
    return (
        <div className={twClassNames('', className)}>
            wow
        </div>
    );
};