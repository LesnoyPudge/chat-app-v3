import plugin from 'tailwindcss/plugin';



export const animationDelay = () => (
    plugin(({ matchUtilities, theme }) => {
        matchUtilities(
            {
                'animation-delay': (value) => {
                    return {
                        'animation-delay': value,
                    };
                },
            },
            {
                values: theme('transitionDelay'),
            },
        );
    })
);