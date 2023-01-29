/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');



const scrollbarClasses = {
    '.scrollbar-primary': {
        'scrollbar-color': 'var(--color-bg-primary-300)',
    },

    '.scrollbar-primary::-webkit-scrollbar': {
        '@apply bg-primary-300 rounded-full': {},
    },

    '.scrollbar-primary::-webkit-scrollbar-thumb': {
        '@apply bg-primary-500 rounded-full': {},
    },

    '.scrollbar-hidden': {
        'scrollbar-width': 'none',
    },

    'scrollbar-hidden::-webkit-scrollbar': {
        '@apply hidden': {},
    },

    '.scrollbar-with-gutter': {
        'scrollbar-gutter': 'stable',
    },

    '.scrollbar-with-gutters': {
        'scrollbar-gutter': 'stable both-edges',
    },

    '.scrollbar-auto-hidden:not(:hover, :focus, :focus-visible, :focus-within)': {
        'scrollbar-color': 'transparent',
    },

    '.scrollbar-auto-hidden:not(:hover, :focus, :focus-visible, :focus-within)::-webkit-scrollbar': {
        '@apply bg-transparent': {},
    },

    '.scrollbar-auto-hidden:not(:hover, :focus, :focus-visible, :focus-within)::-webkit-scrollbar-thumb': {
        '@apply bg-transparent': {},
    },
};

const focusClasses = {
    '.focused': {
        '@apply outline outline-focus outline-[3px]': {},
    },

    '.focus-hidden': {
        '@apply outline-none focus-visible:outline-none focus-within:outline-none': {},
    },
};

const sliderInputClasses = {
    '.slider-input': {
        '@apply grid h-16 items-center': {},
        
        '--track-size': '8px',
        '--handle-width': '10px',
        '--handle-height': '24px',
        '--marker-size': '24px',
        '--horizontal-spacing': '10px',

        '.noUi-target': {
            '@apply bg-neutral border-none shadow-none rounded-none': {},
        },

        '.noUi-horizontal': {
            height: 'var(--track-size)',

            '.noUi-handle': {
                width: 'var(--handle-width)',
                height: 'var(--handle-height)',
                top: 'calc(0px - (var(--handle-height) - var(--track-size)) / 2)',
                right: 'calc(0px - var(--handle-width) / 2)',
            },
        },

        '.noUi-marker-normal': {
            '@apply hidden': {},
        },

        '.noUi-connect': {
            '@apply bg-brand': {},
        },

        '.noUi-connects': {
            '@apply rounded-md': {},

            width: 'calc(100% + var(--horizontal-spacing) * 2)',
            left: 'calc(0px - var(--horizontal-spacing))',
        },

        '.noUi-marker-large': {
            '@apply bg-neutral': {},
        },

        '.noUi-marker-horizontal.noUi-marker-large': {
            '@apply top-0': {},
            
            height: 'var(--marker-size)',
        },

        '.noUi-handle': {
            '@apply cursor-ew-resize before:hidden after:hidden': {},
        },

        '.noUi-value': {
            '@apply text-color-muted text-xs font-bold': {},
        },

        '.noUi-value-horizontal': {
            '@apply cursor-pointer -top-1 -translate-x-1/2 -translate-y-full': {},
        },

        '.noUi-pips-horizontal': {
            '@apply p-0 w-auto': {},

            top: 'calc(0px - (var(--marker-size) - var(--track-size)) / 2)',
            height: 'var(--marker-size)',
            left: 'var(--horizontal-spacing)',
            right: 'var(--horizontal-spacing)',
        },

        '.noUi-base': {
            '@apply w-auto absolute': {},

            left: 'var(--horizontal-spacing)',
            right: 'var(--horizontal-spacing)',
        },
    },
};

const colorPickerClasses = {
    '.color-picker': {
        '.react-colorful': {
            '@apply w-full': {},
        },
    
        '.react-colorful__saturation': {
            '@apply rounded-sm cursor-crosshair mb-2 w-full h-[150px]': {},
        },

        '.react-colorful__saturation-pointer': {
            '@apply w-2 h-2': {},
        },
    
        '.react-colorful__hue': {
            '@apply rounded-sm h-2': {},
        },

        '.react-colorful__hue-pointer': {
            '@apply w-2 h-4 rounded-md border-none bg-white cursor-ew-resize': {},

            '.react-colorful__pointer-fill': {
                '@apply hidden': {},
            },
        },
    
        '.react-colorful__last-control': {
            '@apply rounded-none': {},
        },
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
};

const customClasses = {
    ...scrollbarClasses,
    ...focusClasses,
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