import { default as useMeasureLib } from 'react-use-measure';
import { ResizeObserver as CustomResizeObserver } from '@juggle/resize-observer';



export const useMeasure = () => {
    const [ref, bounds] = useMeasureLib({ polyfill: CustomResizeObserver });
    
    return {
        ref,
        bounds,
    };
};