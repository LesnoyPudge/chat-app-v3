import { FC, useEffect, useRef, useState } from 'react';
// import Nouislider from 'nouislider-react';
import { PropsWithClassName } from '@types';
import noUiSlider, { PartialFormatter } from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { NoUiSlider } from '@libs';
// import 'nouislider/distribute/nouislider.css';



interface ISliderInput extends PropsWithClassName {
    name: string;
    start: number;
    range: number[];
    format?: PartialFormatter;
}

export const SliderInput: FC<ISliderInput> = ({
    className = '',
    name,
    start,
    range,
    format,
}) => {
    const [state, setState] = useState(start ? start : range[0]);

    useEffect(() => {
        console.log('state update:', state);
    }, [state]);

    return (
        <NoUiSlider
            className={className}
            range={range}
            start={state}
            onUpdate={setState}
            format={format}
        />
    );
};