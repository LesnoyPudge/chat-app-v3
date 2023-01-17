import { FC } from 'react';
import SVG from 'react-inlinesvg';
import { twClassNames } from '@utils';
import { AutoSizer } from '@libs';
import { Conditional } from '@components';
import { PropsWithClassName } from '@types';



interface Icon extends PropsWithClassName {
    iconId: string;
    style?: React.CSSProperties;
}

const baseClassName = 'transition-all flex shrink-0';

export const Icon: FC<Icon> = ({ 
    className = '',
    iconId, 
    style,
}) => {
    const src = `/src/assets/icons/${iconId}.svg`;

    return (
        <Conditional isRendered={!!iconId}>
            <div 
                className={twClassNames(baseClassName, className)}
                style={style}
            >
                <AutoSizer>
                    {(size) => (
                        <SVG
                            src={src}
                            cacheRequests
                            {...size}
                        />
                    )}
                </AutoSizer>
            </div>
        </Conditional>
    );
};