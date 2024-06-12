import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import { getCustomClasses } from './src/root/styles/customClasses';
import { animationDelay } from './src/root/styles/animationDelay';
import containerQueries from '@tailwindcss/container-queries';



const pxToRem = (px = 0, baseFontSize = 16) => {
    return px / baseFontSize;
};

export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],

    plugins: [
        containerQueries,
        getCustomClasses(),
        animationDelay(),
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: [ 
                    'Inter', 
                    'Arial', 
                    'Helvetica', 
                    ...defaultTheme.fontFamily.sans
                ],
            },

            colors: {
                primary: {
                    100: 'var(--color-primary-100)',
                    200: 'var(--color-primary-200)',
                    300: 'var(--color-primary-300)',
                    400: 'var(--color-primary-400)',
                    500: 'var(--color-primary-500)',
                    600: 'var(--color-primary-600)',
                    hover: 'var(--color-primary-hover)',
                    active: 'var(--color-primary-active)',
                    selected: 'var(--color-primary-selected)',
                },

                brand: 'var(--color-brand)',
                'brand-hover': 'var(--color-brand-hover)',
                'brand-active': 'var(--color-brand-active)',

                danger: 'var(--color-danger)',
                'danger-hover': 'var(--color-danger-hover)',
                'danger-active': 'var(--color-danger-active)',

                positive: 'var(--color-positive)',
                'positive-hover': 'var(--color-positive-hover)',
                'positive-active': 'var(--color-positive-active)',

                neutral: 'var(--color-neutral)',
                'neutral-hover': 'var(--color-neutral-hover)',
                'neutral-active': 'var(--color-neutral-active)',

                focus: 'var(--color-focus)',
                warn: 'var(--color-warn)',

                icon: {
                    100: 'var(--color-icon-100)',
                    200: 'var(--color-icon-200)',
                    300: 'var(--color-icon-300)',
                },

                'white-black': 'var(--color-white-black)',
                'black-white': 'var(--color-black-white)',

                status: {
                    online: 'var(--status-online)',
                    afk: 'var(--status-afk)',
                    offline: 'var(--status-offline)',
                    dnd: 'var(--status-dnd)',
                },

                scrollbar: {
                    track: 'var(--scrollbar-track)',
                    thumb: 'var(--scrollbar-thumb)',
                },

                selection: 'var(--selection)',
            },

            textColor: {
                color: {
                    primary: 'var(--color-font-primary)',
                    secondary: 'var(--color-font-secondary)',
                    base: 'var(--color-font-base)',
                    muted: 'var(--color-font-muted)',
                    error: 'var(--color-font-error)',
                    link: 'var(--color-font-link)',
                },
            },

            caretColor: {
                primary: 'var(--color-font-primary)',
                secondary: 'var(--color-font-secondary)',
                base: 'var(--color-font-base)',
            },

            fontSize: {
                'heading-2xl': [`${pxToRem(34)}rem`, `${pxToRem(40)}rem`],
                'heading-xl': [`${pxToRem(25)}rem`, `${pxToRem(30)}rem`],
                'heading-l': [`${pxToRem(20)}rem`, `${pxToRem(24)}rem`],
                'heading-m': [`${pxToRem(17)}rem`, `${pxToRem(22)}rem`],
                'heading-s': [`${pxToRem(12)}rem`, `${pxToRem(16)}rem`],
                '2xs': [`${pxToRem(10)}rem`, `${pxToRem(12)}rem`],
                0: ['0px', '0px'],
            },

            boxShadow: {
                'elevation-stroke': 'var(--elevation-stroke)',
                'elevation-low': 'var(--elevation-low)',
                'elevation-medium': 'var(--elevation-medium)',
                'elevation-high': 'var(--elevation-high)',
            },

            animation: {
                'loading-pulse': 'var(--loading-pulse-animation)',
            },

            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
                // xl: { max: '1279px' }, // => @media (max-width: 1279px) { ... }
                // lg: { max: '1023px' }, // => @media (max-width: 1023px) { ... }
                // md: { max: '767px' }, // => @media (max-width: 767px) { ... }
                // sm: { max: '639px' }, // => @media (max-width: 639px) { ... }
            },

            height: {
                'message-editor': 'var(--message-editor-height)',
            },

            minHeight: {
                'message-editor': 'var(--message-editor-height)',
            },
        },
    },
} satisfies Config;
