import classNames, { Argument } from 'classnames';
import { createTailwindMerge, getDefaultConfig, mergeConfigs } from 'tailwind-merge';



const customTwMerge = createTailwindMerge(getDefaultConfig, (config) =>
    mergeConfigs(config, {
        // ↓ Add values to existing theme scale or create a new one
        //   Not all theme keys form the Tailwind config are supported by default.
        theme: {
            // spacing: ['sm', 'md', 'lg'],
        },

        classGroups: {
            // ↓ Adding new class group
            // mySpecialClassGroup: [{ special: ['1', '2'] }],
            // ↓ Adding value to existing class group
            // animate: ['animate-magic'],
            'font-size': [
                'text-heading-2xl',
                'text-heading-xl',
                'text-heading-l',
                'text-heading-m',
                'text-heading-s',
                'text-2xs',
                'message-font-size',
            ],
            'py': ['message-y-padding'],
        },

        conflictingClassGroups: {
            // ↓ ID of class group which creates a conflict with …
            //     ↓ … classes from groups with these IDs
            // foo: ['bar'],
        },
    }),
);

export const twClassNames = (...args: Argument[]) => customTwMerge(classNames(args));