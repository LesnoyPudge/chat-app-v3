import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './components/App';
import { store } from './redux';



ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
).render(
    <Provider store={store}>
        <App/>
    </Provider>,
);