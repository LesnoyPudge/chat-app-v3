import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './components';
import { store } from '@redux/store';



ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
).render(
    <Provider store={store}>
        <App/>
    </Provider>,
);