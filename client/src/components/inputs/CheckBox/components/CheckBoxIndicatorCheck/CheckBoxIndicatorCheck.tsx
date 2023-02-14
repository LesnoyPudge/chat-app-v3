import { twClassNames } from '@utils';
import { FC } from 'react';
import { Icon } from '@components';
import { PropsWithClassName } from '@types';



interface CheckBoxIndicatorCheck extends PropsWithClassName {
    checked: boolean;
}

const styles = {
    checkBox: {
        base: 'w-5 h-5 rounded border-2 border-brand',
        active: 'bg-brand',
    },
    checkBoxIcon: {
        base: 'w-full h-full fill-white',
        active: 'hidden',
    },
};

export const CheckBoxIndicatorCheck: FC<CheckBoxIndicatorCheck> = ({
    className = '',
    checked,
}) => {
    return (
        <>
            <div className={twClassNames(
                styles.checkBox.base,
                { [styles.checkBox.active]: checked },
                className,
            )}>
                <Icon
                    className={twClassNames(
                        styles.checkBoxIcon.base,
                        { [styles.checkBoxIcon.active]: !checked },
                    )}
                    iconId='check-icon'
                />
            </div>
        </>
    );
};