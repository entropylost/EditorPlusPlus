import $ from '@implode-nz/html/';
import icon from './epp.svg';

export default (epp, theme) => {
    import('./index.styl');
    const root = $.div([]);
    root.innerHTML = icon;
    theme.root = root;
};
