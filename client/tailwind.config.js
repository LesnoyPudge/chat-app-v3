/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');



/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],

    
    plugins: [
        require('tailwindcss-scoped-groups')({
            groups: ['1', '2', '3', '4', '5'],
        }),
    ],

    theme: {
        extend: {
            fontFamily: {
                'sans': [ 'Inter', 'Arial', 'Helvetica', ...defaultTheme.fontFamily.sans],
            },
            
            colors: {
                green: 'var(--green)',
                white: 'var(--white)',
                red: 'var(--red)',
                status: {
                    online: 'var(--status-online)',
                    afk: 'var(--status-afk)',
                    offline: 'var(--status-offline)',
                    dnd: 'var(--status-dnd)',
                },
                icon: {
                    100: 'var(--icon-100)',
                    200: 'var(--icon-200)',
                    300: 'var(--icon-300)',
                },
            },
              
            textColor: {
                primary: 'var(--color-font-primary)',
                secondary: 'var(--color-font-secondary)',
                normal: 'var(--color-font-normal)',
                muted: 'var(--color-font-muted)',
                link: 'var(--color-font-link)',
                error: 'var(--color-font-error)',
                required: 'var(--color-font-required)',
                placeholder: 'var(--color-font-placeholder)',
                room: 'var(--color-font-rooms)',
            },

            backgroundColor: {
                primary: {
                    100: 'var(--color-bg-primary-100)',
                    200: 'var(--color-bg-primary-200)',
                    300: 'var(--color-bg-primary-300)',
                    400: 'var(--color-bg-primary-400)',
                    500: 'var(--color-bg-primary-500)',
                },

                hover: 'var(--color-bg-hover)',
                active: 'var(--color-bg-active)',
                selected: 'var(--color-bg-selected)',
                light: 'var(--color-bg-light)',
                message: 'var(--color-bg-message)',
                'slider-track': 'var(--color-bg-slider-track)',

                brand: 'var(--color-bg-brand)',
                'brand-hover': 'var(--color-bg-brand-hover)',
                'brand-active': 'var(--color-bg-brand-active)',

                danger: 'var(--color-bg-danger)',
                'danger-hover': 'var(--color-bg-danger-hover)',
                'danger-active': 'var(--color-bg-danger-active)',

                neutral: 'var(--color-bg-neutral)',
                'neutral-hover': 'var(--color-bg-neutral-hover)',
                'neutral-active': 'var(--color-bg-neutral-active)',
            },

            fontSize: {
                'heading-xxl': ['34px', '40px'],
                'heading-xl': ['25px', '30px'],
                'heading-l': ['20px', '24px'],
                'heading-m': ['17px', '22px'],
                'heading-s': ['12px', '16px'],
                xxs: ['10px', '12px'],
            },

            boxShadow: {
                'elevation-stroke': 'var(--elevation-stroke)',
                'elevation-low': 'var(--elevation-low)',
                'elevation-medium': 'var(--elevation-medium)',
                'elevation-high': 'var(--elevation-high)',
            },

            borderColor: {
                primary: {
                    500: 'var(--color-bg-primary-500)',
                },
            },

            screens: {
                xl: { max: '1279px' },
                // => @media (max-width: 1279px) { ... }
    
                lg: { max: '1023px' },
                // => @media (max-width: 1023px) { ... }
    
                md: { max: '767px' },
                // => @media (max-width: 767px) { ... }
    
                sm: { max: '639px' },
                // => @media (max-width: 639px) { ... }
            },
        },
    },
};
