/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');



/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    // darkMode: ''
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Arial', 'Helvetica', ...defaultTheme.fontFamily.sans],
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
            },

            fontSize: {
                heading_xxl: ['34px', '40px'],
                heading_xl: ['25px', '30px'],
                heading_l: ['20px', '24px'],
                heading_m: ['17px', '22px'],
                heading_s: ['12px', '16px'],
            },

            fill: {
                icon: 'var(--icon-accent)',
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
    plugins: [],
};
