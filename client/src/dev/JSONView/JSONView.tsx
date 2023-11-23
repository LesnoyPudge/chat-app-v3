/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PropsWithClassName } from '@types';
import { logger } from '@utils';
import { FC } from 'react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';



interface ITheme {
    [key: string]: string;
}

interface IProps extends PropsWithClassName {
    json?: any;
    data?: any;
    replacer?: (key: string, value: any) => any | null;
    space?: number | string;
    themeClassName?: string;
    theme?: ITheme;
    silent?: boolean;
    onJSONPrettyError?: (e: Error) => void;
    mainStyle?: string;
    keyStyle?: string;
    stringStyle?: string;
    valueStyle?: string;
    booleanStyle?: string;
    errorStyle?: string;
}

const FixedJSON = JSONPretty as unknown as FC<IProps>;

export const JSONView: FC<{data: unknown}> = ({ data }) => {
    return (
        <FixedJSON
            className='[&>*]:max-h-[500px]'
            data={data}
            onJSONPrettyError={logger.error}
            space='4'
        />
    );
};