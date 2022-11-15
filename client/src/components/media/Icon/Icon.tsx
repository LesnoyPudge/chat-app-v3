import { FC } from 'react';
import SVG from 'react-inlinesvg';
import { twClassNames } from '@utils';
import { AutoSizer } from '@libs';
import { Conditional } from '@components';



interface IIcon {
    className?: string;
    iconId: string;
}

const baseClassName = 'transition-all flex flex-shrink-0';

export const Icon: FC<IIcon> = ({ 
    iconId,
    className = '', 
}) => {
    return (
        <Conditional isRendered={!!iconId}>
            <div className={twClassNames(baseClassName, className)}>
                <AutoSizer>
                    {(size) => (
                        <SVG
                            src={`/src/assets/icons/${iconId}.svg`}
                            cacheRequests
                            {...size}
                        />
                    )}
                </AutoSizer>
            </div>
        </Conditional>
    );
};