import { getEnv } from '@utils';
import React from 'react';



export const axeReact = async() => {
    if (getEnv().CUSTOM_NODE_ENV === 'production') return;

    const ReactDOM = await import('react-dom');

    import('@axe-core/react').then((axe) => {
        axe.default(React, ReactDOM, 1000, {
            disableDeduplicate: true,
            rules: [
                // https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md
                {
                    id: 'color-contrast',
                    enabled: false,
                },
                {
                    id: 'color-contrast-enhanced',
                    enabled: false,
                },
            ],
        });
    });
};