import { easings, UseTransitionProps } from '@react-spring/web';
import { recursive } from 'merge';



type Option = (extendedOptions?: UseTransitionProps) => UseTransitionProps;

interface GetTransitionOptions {
    fullScreenModal: Option;
    withOpacity: Option;
    defaultModal: Option;
    defaultContextMenu: Option;
}

const getWithOpacity = () => {
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
    } as UseTransitionProps;
};

export const getTransitionOptions: GetTransitionOptions = {
    fullScreenModal: (extendedOptions = {}) => {
        return recursive({}, getWithOpacity(), {
            from: { scale: 1.2 },
            enter: { scale: 1 },
            leave: { scale: 1.2 },
            config: { duration: 200 },
        }, extendedOptions);
    },

    withOpacity: (extendedOptions = {}) => {
        return recursive({}, getWithOpacity(), extendedOptions);
    },

    defaultModal: (extendedOptions = {}) => {
        return recursive({}, getWithOpacity(), {
            from: { scale: 0 },
            enter: { scale: 1 },
            leave: { scale: 0 },
            config: {
                duration: 350,
                easing: easings.easeOutBack,
            },
        }, extendedOptions);
    },

    defaultContextMenu: (extendedOptions = {}) => {
        return recursive({}, getWithOpacity(), {
            from: { scale: 0.95 },
            enter: { scale: 1 },
            leave: { scale: 0.95 },
        }, extendedOptions);
    },
};