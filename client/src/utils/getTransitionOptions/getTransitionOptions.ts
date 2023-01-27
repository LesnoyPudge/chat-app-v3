import { easings, UseTransitionProps } from '@react-spring/web';
import { deepMerge } from '@reExport';



const withOpacity = () => {
    return {
        from: {
            opacity: 0,
        },
        enter: {
            opacity: 1,
        },
        leave: {
            opacity: 0,
        },
    };
};

export const getTransitionOptions = {
    fullScreenModal: <T extends UseTransitionProps<boolean>>(extendedOptions: T) => (
        deepMerge(withOpacity(), {
            from: { scale: 1.2 },
            enter: { scale: 1 },
            leave: { scale: 1.2 },
            config: { duration: 200 },
        }, extendedOptions)
    ),

    withOpacity: <T extends UseTransitionProps<boolean>>(extendedOptions: T) => (
        deepMerge(withOpacity(), extendedOptions)
    ),

    defaultModal: <T extends UseTransitionProps<boolean>>(extendedOptions: T) => (
        deepMerge(withOpacity(), {
            from: { scale: 0.1 },
            enter: { scale: 1 },
            leave: { scale: 0.1 },
            config: {
                duration: 350,
                easing: easings.easeOutBack,
            },
        }, extendedOptions)
    ),

    defaultContextMenu: <T extends UseTransitionProps<boolean>>(extendedOptions: T) => (
        deepMerge(withOpacity(), {
            from: { scale: 0.95 },
            enter: { scale: 1 },
            leave: { scale: 0.95 },
        }, extendedOptions)
    ),

    inOut: <T extends UseTransitionProps<boolean>>(extendedOptions: T) => (
        deepMerge({
            from: { value: 0 },
            enter: { value: 1 },
            leave: { value: 0 },
        }, extendedOptions)
    ),
};