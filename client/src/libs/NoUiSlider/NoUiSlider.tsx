import { FC, useEffect, useMemo, useRef } from 'react';
import noUiSlider, { API, Options, PartialFormatter } from 'nouislider';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';



interface Range {
    min: [number, number];
    max: [number, number];
    [key: `${number}%`]: [number, number];
}

interface INoUiSlider extends PropsWithClassName {
    range: number[];
    start: number;
    format?: PartialFormatter;
    onUpdate?: (value: number) => void;
}

const defaultFormat: PartialFormatter = {
    to: (value: number) => {
        return `${value}px`;
    },
};

const toValidRange = (invalidRange: number[]) => {            
    invalidRange = invalidRange.sort((a, b) => a - b);

    const values: Record<string, number> = {};
    const minValue = invalidRange[0];
    const maxValue = invalidRange[invalidRange.length - 1];

    invalidRange.forEach((value, index) => {
        if (index === 0) {
            values['min'] = value;
            return;
        }

        if (index === invalidRange.length - 1) {
            values['max'] = value;
            return;
        }

        const result = (value - minValue) * 100 / (maxValue - minValue);
        values[`${result}%`] = value;
    });
    
    return values as unknown as Range;
};

export const NoUiSlider: FC<INoUiSlider> = ({
    className = '',
    range,
    start,
    format = defaultFormat,
    onUpdate,
}) => {
    const elementRef = useRef<HTMLDivElement | null>(null);
    const sliderRef = useRef<API | null>(null);
    const initialOptionsRef = useRef<Options>({
        range: toValidRange(range),
        start,
        connect: [true, false],
        keyboardSupport: true,
        snap: true,
        pips: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            mode: 'steps',
            format,
        },
    });

    const handleClick = (e: Event) => {
        if (!e.target) return;
        if (!sliderRef.current) return;
        const target = e.target as HTMLDivElement;
        const value = Number(target.getAttribute('data-value'));

        sliderRef.current.set(value);
    };

    const pipListeners = useMemo(() => ({
        set: () => {
            if (!elementRef.current) return;

            [...elementRef.current.querySelectorAll('.noUi-value')].forEach((pip) => {
                
                pip.addEventListener('click', handleClick);
            });
        },

        clear: () => {
            if (!elementRef.current) return;

            [...elementRef.current.querySelectorAll('.noUi-value')].forEach((pip) => {
                pip.removeEventListener('click', handleClick);
            });
        },
    }), []);
    
    useEffect(() => {
        if (!elementRef.current) return;
        
        const slider = noUiSlider.create(elementRef.current, initialOptionsRef.current);
        sliderRef.current = slider;

        return () => {
            slider.destroy();
            sliderRef.current = null;
            pipListeners.clear();
        };
    }, [pipListeners]);

    useEffect(() => {
        if (!sliderRef.current) return;
        if (!onUpdate) return;

        const slider = sliderRef.current;

        slider.off('update');
        slider.on('update', (_, __, value) => onUpdate(value[0]));
        
    }, [onUpdate]);

    useEffect(() => {
        if (!sliderRef.current) return;

        sliderRef.current.updateOptions({
            range: toValidRange(range),
            start,
        }, true);

        pipListeners.set();
    }, [pipListeners, range, start]);

    return (
        <div className={twClassNames('slider-input', className)}>
            <div ref={elementRef}></div>
        </div>
    );
};