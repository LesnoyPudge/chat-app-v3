import { getEnv } from '@utils';
import React from 'react';
import ReactDOM from 'react-dom';



export const axeReact = () => {
    if (getEnv().CUSTOM_NODE_ENV !== 'production') {
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
    }
};