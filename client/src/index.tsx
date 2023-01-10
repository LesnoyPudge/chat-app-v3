import ReactDOM from 'react-dom/client';
import { Root } from '@root';
import { StrictMode } from 'react';
import { getHTML } from '@utils';



ReactDOM.createRoot(getHTML().app).render(<StrictMode><Root/></StrictMode>);