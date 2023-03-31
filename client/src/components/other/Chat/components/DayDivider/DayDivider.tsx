import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
    


interface DayDivider extends PropsWithClassName {
    time: number;
}

const styles = {
    wrapper: 'flex pt-4 pb-3',
    dividerLine: `relative grow mx-4 before:absolute 
    before:-z-10 before:h-0.5 before:bg-primary-100 
    before:w-full before:top-1/2 before:-translate-y-1/2`,
    text: 'text-xs font-semibold text-color-muted',
};

export const DayDivider: FC<DayDivider> = ({
    className = '',
    time,
}) => {
    const formattedDate = format(time, 'd MMMM yyyy', { locale: ru });
   
    return (
        <div 
            className={twClassNames(styles.wrapper, className)}
            role='separator'
            aria-label={formattedDate}
        >
            <div className={styles.dividerLine}></div>

            <span className={styles.text}>
                {formattedDate}
            </span>

            <div className={styles.dividerLine}></div>
        </div>
    );
};