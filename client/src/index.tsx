import ReactDOM from 'react-dom/client';
import { Root } from '@root';
import React, { StrictMode } from 'react';
import { getEnv, getHTML } from '@utils';



const App = (
    <StrictMode>
        <Root/>
    </StrictMode>
);

ReactDOM.createRoot(getHTML().app).render(App);

if (getEnv().CUSTOM_NODE_ENV !== 'production') {
    const axe = await import('@axe-core/react');

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
}