import { easings, UseTransitionProps } from '@react-spring/web';
import { deepMerge } from '@reExport';
import { Merge } from '@types';



type Options<DEFAULT extends (UseTransitionProps<boolean>)[]> = <TRANSITION extends UseTransitionProps<boolean>, OBJECT extends object>(extendedOptions?: TRANSITION | OBJECT | object) => Merge<[...DEFAULT, OBJECT]>;

const inOut = () => ({
    from: { value: 0 },
    enter: { value: 1 },
    leave: { value: 0 },
});

const opacity = () => ({
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
});

const fullScreenModal = () => ({
    from: { scale: 1.2 },
    enter: { scale: 1 },
    leave: { scale: 1.2 },
    config: { duration: 200 },
});

const defaultModal = () => ({
    from: { scale: 0.1 },
    enter: { scale: 1 },
    leave: { scale: 0.1 },
    config: {
        duration: 350,
        easing: easings.easeOutBack,
    },
});

const defaultContextMenu = () => ({
    from: { scale: 0.95 },
    enter: { scale: 1 },
    leave: { scale: 0.95 },
});

interface GetTransitionOptions {
    fullScreenModal: Options<[ReturnType<typeof opacity>, ReturnType<typeof fullScreenModal>]>;
    withOpacity: Options<[ReturnType<typeof opacity>]>;
    defaultModal: Options<[ReturnType<typeof opacity>, ReturnType<typeof defaultModal>]>;
    defaultContextMenu: Options<[ReturnType<typeof opacity>, ReturnType<typeof defaultContextMenu>]>;
    inOut: Options<[ReturnType<typeof inOut>]>;
    empty: Options<[]>;
}

export const getTransitionOptions = {
    fullScreenModal: (extendedOptions = {}) => {
        return deepMerge(opacity(), fullScreenModal(), extendedOptions);
    },

    withOpacity: (extendedOptions = {}) => {
        return deepMerge(opacity(), extendedOptions);
    },

    defaultModal: (extendedOptions = {}) => {
        return deepMerge(opacity(), defaultModal(), extendedOptions);
    },

    defaultContextMenu: (extendedOptions = {}) => {
        return deepMerge(opacity(), defaultContextMenu(), extendedOptions);
    },

    inOut: (extendedOptions = {}) => {
        return deepMerge(inOut(), extendedOptions);
    },

    empty: (d = {}) => {
        return d;
    },
} as GetTransitionOptions;