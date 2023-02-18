import { twClassNames } from '@utils';
import { formatRelative, lightFormat, toDate } from 'date-fns';
import { ru } from 'date-fns/locale';
import { FC } from 'react';



type DateFormatType = 'dd.MM.yyyy HH:mm:ss' | 'HH:mm:ss' | 'dd.MM.yyyy' | 'HH:mm';

interface ITime {
    className?: string;
    id?: string;
    date: number | string | Date;
    format?: DateFormatType;
    customFormat?: string;
}

export const Time: FC<ITime> = ({
    className = '',
    id,
    date,
    format = 'dd.MM.yyyy HH:mm:ss',
    customFormat = '',
}) => {
    const parsedDate = toDate(typeof date === 'string' ? parseInt(date) : date);
    const chosenFormat = customFormat ? customFormat : format;
    const content = lightFormat(parsedDate, chosenFormat);

    const label = formatRelative(parsedDate, Date.now(), { locale: ru });
    const dateTime = parsedDate.toLocaleString();
    
    return (
        <time
            className={twClassNames(className)}
            id={id}
            aria-label={label}
            dateTime={dateTime}
        >
            {content}
        </time>
    );
};