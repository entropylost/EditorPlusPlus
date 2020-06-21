import $ from '@implode-nz/html/';

export default (epp, theme) => {
    import('./index.styl');
    const splitElements = 'Editor++'.split('').flatMap((e) => [$.span([]), e]);
    const titleInterior = $.div('title-interior', splitElements);
    const title = $.div(
        'title',
        {
            onclick() {
                title.classList.toggle('activated');
            },
        },
        [$.div.icon('icon', []), titleInterior]
    );
    const interior = $.div('interior', []);
    const root = $.div('container', [title, interior]);
    document.body.appendChild(root);
};
