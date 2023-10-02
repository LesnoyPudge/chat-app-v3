import plugin from 'tailwindcss/plugin';



const customClasses = {
    '.simplebar-custom': {},

    '.scrollbar-hidden': {},

    '.color-picker': {},

    '.slider-input': {},

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
        '@apply outline-focus': {},
    },

    '.focus-hidden': {
        '@apply outline-transparent': {},
    },

    '.message-font-size': {
        'font-size': 'var(--message-font-size)',
        'line-height': 'var(--message-line-height)',
    },

    '.message-y-padding': {
        'padding-top': 'var(--message-y-padding)',
        'padding-bottom': 'var(--message-y-padding)',
    },

    '.message-emoji-wrapper-size': {
        'height': 'var(--message-emoji-wrapper-height)',
        'width': 'var(--message-emoji-wrapper-width)',
    },

    '.message-emoji-font-size': {
        'font-size': 'var(--message-emoji-font-size)',
    },

    '.message-emoji-bg-size': {
        'background-size': 'var(--message-emoji-bg-size)',
    },

    '.message-group-head': {
        'padding-top': 'var(--message-gap)',
    },

    '.page': {
        '@apply h-screen w-screen isolate': {},
    },
};

export const getCustomClasses = () => (
    plugin(({ addUtilities }) => {
        addUtilities(customClasses);
    })
);