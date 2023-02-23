/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');



const scrollbarClasses = {
    '.scrollbar': {
        '1': {},
    },

    '.scrollbar-with-opposite-gutter': {
        '2': {},
    },

    'scrollbar-hidden': {
        '5': {},
    },
    
    'scrollbar-auto-hide': {
        '6': {},
    },

    'scrollbar-is-alive': {
        '7': {},
    },

    '.scrollbar-small': {
        '8': {},
    },
};

const colorPickerClasses = {
    '.color-picker': {
        '3': {},
    },
};

const sliderInputClasses = {
    '.slider-input': {
        '4': {},
    },
};

const otherClasses = {
    '.image-bg-fullscreen': {
        '@apply fixed top-0 left-0 w-screen h-screen -z-[1] object-cover object-center': {},
    },

    '.overlay-item-wrapper': {
        '@apply pointer-events-none fixed inset-0': {},
    },

    '.truncated': {
        '@apply truncate min-w-0 w-full': {},
    },

    '.sr-input': {
        '@apply absolute inset-0 opacity-0 text-0 cursor-pointer': {},
    },

    '.focused': {
        '@apply outline outline-focus outline-[3px]': {},
    },

    '.focus-hidden': {
        '@apply outline-none focus-visible:outline-none focus-within:outline-none': {},
    },

    '.message-font-size': {
        'font-size': 'var(--message-font-size)',
        'line-height': 1,
    },
};

const customClasses = {
    ...scrollbarClasses,
    ...sliderInputClasses,
    ...colorPickerClasses,
    ...otherClasses,
};

const getCustomClasses = () => (
    plugin(({ addUtilities }) => {
        addUtilities(customClasses);
    })
);

module.exports = getCustomClasses;