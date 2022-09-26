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
                'sans': ['Arial', 'Helvetica', ...defaultTheme.fontFamily.sans],
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
            },
              
            textColor: {
                primary: 'var(--color-font-primary)',
                secondary: 'var(--color-font-secondary)',
                normal: 'var(--color-font-normal)',
                muted: 'var(--color-font-muted)',
                link: 'var(--color-font-link)',
                error: 'var(--color-font-error)',
                required: 'var(--color-font-required)',
            },

            backgroundColor: {
                primary: {
                    100: 'var(--color-bg-primary-100)',
                    200: 'var(--color-bg-primary-200)',
                    300: 'var(--color-bg-primary-300)',
                    400: 'var(--color-bg-primary-400)',
                    500: 'var(--color-bg-primary-500)',
                },
                
                secondary: {
                    100: 'var(--color-bg-secondary-100)',
                    200: 'var(--color-bg-secondary-200)',
                    300: 'var(--color-bg-secondary-300)',
                },

                hover: 'var(--color-bg-hover)',
                active: 'var(--color-bg-active)',
                selected: 'var(--color-bg-selected)',

                light: 'var(--color-bg-light)',
            },

            fontSize: {
                heading_xxl: ['34px', '40px'],
                heading_xl: ['25px', '30px'],
                heading_l: ['20px', '24px'],
                heading_m: ['17px', '22px'],
                heading_s: ['12px', '16px'],
            },

            fill: {
                icon: {
                    100: 'var(--icon-100)',
                    200: 'var(--icon-200)',
                    300: 'var(--icon-300)',
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

            boxShadow: {
                top_bar: 'var(--shadow-top-bar)',
            },

            borderColor: {
                primary: {
                    500: 'var(--color-bg-primary-500)',
                },
            },
        },
    },
};