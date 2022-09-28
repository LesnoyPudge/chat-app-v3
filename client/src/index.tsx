import ReactDOM from 'react-dom/client';
import { Root } from '@root';
import { StrictMode } from 'react';



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <Root/>,
    </StrictMode>,
);