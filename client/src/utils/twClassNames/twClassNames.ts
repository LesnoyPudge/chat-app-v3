import classNames, { Argument } from 'classnames';
import { createTailwindMerge, getDefaultConfig, mergeConfigs } from 'tailwind-merge';



// https://github.com/dcastil/tailwind-merge/blob/v1.10.0/docs/
const customTwMerge = createTailwindMerge(getDefaultConfig, (config) =>
    mergeConfigs(config, {
        classGroups: {
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
    }),
);

export const twClassNames = (...args: Argument[]): string => {
    if (args.length === 0) return '';
    if (args.length === 1 && typeof args[0] === 'string') return args[0];

    return customTwMerge(classNames(args));
};