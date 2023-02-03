/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const getCustomClasses = require('./src/root/styles/customClasses.js');




const pxToRem = (px = 0, baseFontSize = 16) => {
    return px / baseFontSize;
};

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],

    plugins: [
        getCustomClasses(),
    ],

    theme: {
        extend: {
            fontFamily: {
                // "Noto Sans","Helvetica Neue",Helvetica,Arial,sans-serif
                sans: [ 'Inter', 'Arial', 'Helvetica', ...defaultTheme.fontFamily.sans],
                // sans: ['Noto Sans', 'Helvetica Neue', 'Helvetica', 'Arial', ...defaultTheme.fontFamily.sans],
                // sans: ['"Noto Sans"'],
                // sans: ['Inter'],
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
            },
              
            textColor: {
                color: {
                    primary: 'var(--color-font-primary)',
                    secondary: 'var(--color-font-secondary)',
                    base: 'var(--color-font-base)',
                    muted: 'var(--color-font-muted)',
                    link: 'var(--color-font-link)',
                    error: 'var(--color-font-error)',
                },
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
        },
    },
};
