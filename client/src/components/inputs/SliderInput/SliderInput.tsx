import { FC, useEffect, useRef } from 'react';
// import Nouislider from 'nouislider-react';
import { PropsWithClassName } from '@types';
import noUiSlider, { PartialFormatter } from 'nouislider';
import 'nouislider/dist/nouislider.css';
// import 'nouislider/distribute/nouislider.css';



interface ISliderInput extends PropsWithClassName {
    name: string;
    start: number;
    range: any;
    format?: PartialFormatter;
}

export const SliderInput: FC<ISliderInput> = ({
    className = '',
    name,
    start,
    range,
    format,
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    // const start = 0;
    // const range = {
    //     min: [0, 0],
    //     '16.6667%': [4, 4],
    //     '33.3333%': [8, 8],
    //     '66.6667%': [16, 16],
    //     max: [24, 24],
    // };

    useEffect(() => {
        if (!ref.current) return;
        const target = ref.current;
        const slider = noUiSlider.create(target, {
            range,
            start,
            connect: [true, false],
            keyboardSupport: true,
            snap: true,
            pips: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                mode: 'steps',
                stepped: true,
                format: format ? format : {
                    to: (value: number) => {
                        return `${value}px`;
                    },
                },
            },
        });

        return () => {
            slider.destroy();
        };
    }, [format, range, start]);

    const handleChange = () => {

    };

    return (
        <div className='rangeInput'>
            <div ref={ref}></div>
        </div>
    );
};

{/* <Nouislider
                range={{ min: 0, max: 9 }}
                start={0}
                start={start} 
                connect={[true, false]}
                clickablePips
                keyboardSupport
                snap
                range={range}
                pips={{
                    mode: 'steps',
                }}
                onChange={handleChange}
            /> */}