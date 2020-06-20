import $ from '@implode-nz/html/';

export default (epp, theme) => {
    import('./index.styl');
    const splitElements = 'Editor++'
        .split('')
        .flatMap((e) => [$.span([]), e])
        .slice(1);
    const root = $.div('container', splitElements);
    document.body.appendChild(root);
};
