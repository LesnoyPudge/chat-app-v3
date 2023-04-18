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

const styles = {
    wrapper: 'relative flex shrink-0 transition-all',
    svg: 'absolute inset-0 m-auto',
};

export const Icon: FC<Icon> = ({ 
    className = '',
    iconId, 
    style,
}) => {
    const src = `/src/assets/icons/${iconId}.svg`;

    return (
        <Conditional isRendered={!!iconId}>
            <div 
                className={twClassNames(styles.wrapper, className)}
                style={style}
            >
                {/* <AutoSizer>
                    {(size) => ( */}
                <SVG
                    className={styles.svg}
                    src={src}
                    cacheRequests
                    // {...size}
                />
                {/* )} */}
                {/* </AutoSizer> */}
            </div>
        </Conditional>
    );
};