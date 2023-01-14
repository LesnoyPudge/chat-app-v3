import ReactDOM from 'react-dom/client';
import { Root } from '@root';
import React, { StrictMode } from 'react';
import { getEnv, getHTML } from '@utils';



if (getEnv().CUSTOM_NODE_ENV !== 'production') {
    const axe = await import('@axe-core/react');
    axe.default(React, ReactDOM, 1000);
}

ReactDOM.createRoot(getHTML().app).render(<StrictMode><Root/></StrictMode>);