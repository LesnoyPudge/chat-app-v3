import '@total-typescript/ts-reset';
import ReactDOM from 'react-dom/client';
import { Root } from '@root';
import { getHTML } from '@utils';
import { afterInit, beforeInit } from './root/helpers';


console.log('huh?', Root);
(async() => {
    await beforeInit();

    ReactDOM.createRoot(getHTML().app).render(<Root/>);

    afterInit();
})();