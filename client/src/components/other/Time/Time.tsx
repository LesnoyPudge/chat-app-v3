import { twClassNames } from '@utils';
import { lightFormat, toDate } from 'date-fns';
import { FC } from 'react';



type DateFormatType = 'dd.MM.yyyy HH:mm:ss' | 'HH:mm:ss' | 'dd.MM.yyyy' | 'HH:mm';

interface ITime {
    className?: string;
    date: number | string | Date;
    format?: DateFormatType;
    customFormat?: string;
}

export const Time: FC<ITime> = ({
    className = '',
    date,
    format = 'dd.MM.yyyy HH:mm:ss',
    customFormat = '',
}) => {
    const parsedDate = toDate(typeof date === 'string' ? parseInt(date) : date);
    const chosenFormat = customFormat ? customFormat : format;
    const content = lightFormat(parsedDate, chosenFormat);
    const dateTime = parsedDate.toISOString();

    return (
        <time
            className={twClassNames(className)}
            dateTime={dateTime}
        >
            {content}
        </time>
    );
};