import { render } from 'solid-js/web';
import './index.css';
import App from './App';

console.log('index.tsx загружен');

render(() => <App />, document.getElementById('root')!);
