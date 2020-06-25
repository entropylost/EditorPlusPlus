function activate(epp) {
    const { $, theme } = epp;
    import('./default.theme.styl');
    import('./epp.svg').then((svg) => document.querySelectorAll('.icon').forEach((x) => (x.innerHTML = svg.default)));
    const splitElements = 'Editor++'.split('').flatMap((e) => [$.span([]), e]);
    const titleInterior = $.div('title-interior', splitElements);
    const title = $.div(
        'title',
        {
            onclick() {
                container.classList.toggle('activated');
            },
        },
        [$.div.icon('icon', []), titleInterior]
    );
    const interior = $.div('interior', []);
    const container = $.div('container', [title, interior]);
    const shadow = $.div('container-shadow', container);
    document.body.appendChild(shadow);

    // Page manipulation

    let rootPage = null;
    let currentPage = () => rootPage;
    let pages = [];

    theme.pages = {};

    theme.page = (id, name, elements) => {
        const root = id === 'root';

        let pageTitle = null;

        if (name !== '') {
            const back = $.div['back-button'](
                {
                    onclick() {
                        if (currentPage() !== page) return theme.error('The current page is not this page.');
                        if (pages.length === 0) {
                            if (!root) return theme.error('Non-root page with no previous page.');
                            container.classList.remove('activated');
                        } else {
                            const old = pages.pop();
                            page.classList.remove('page-in-left');
                            page.classList.remove('page-in-right');
                            page.classList.add('page-out-right');

                            old.classList.remove('page-out-left');
                            old.classList.remove('page-out-right');
                            old.classList.add('page-in-left');
                            currentPage = () => old;
                        }
                    },
                },
                $.div['back-arrow']([])
            );

            pageTitle = $.div['page-title'](root ? [name] : [back, name]);
            elements.unshift(theme.seperator());
        }

        const pageInterior = $.div['page-interior'](elements);

        if (name === '') pageInterior.classList.add('no-title');

        const page = $.div.page(pageTitle == null ? pageInterior : [pageTitle, pageInterior]);

        if (root) {
            rootPage = page;
            if (pages.length === 0) page.classList.add('page-in-left');
        }

        interior.appendChild(page);

        theme.pages[id] = {
            append(...elems) {
                for (const x of elems) {
                    if (typeof x === 'string') pageInterior.appendChild(document.createTextNode(x));
                    else pageInterior.appendChild(x);
                }
            },
            name,
            element: page,
        };

        return page;
    };

    theme.next = (name, page, image) => {
        const arrow = $.div['forward-arrow']([]);
        let svg = '';
        if (image != null) {
            svg = $.div['forward-button-graphic-display']([]);
            svg.innerHTML = image;
        }
        const button = $.div['forward-button'](
            {
                onclick() {
                    const current = currentPage();
                    pages.push(current);
                    current.classList.remove('page-in-left');
                    current.classList.remove('page-in-right');
                    current.classList.add('page-out-left');

                    page.classList.remove('page-out-left');
                    page.classList.remove('page-out-right');
                    page.classList.add('page-in-right');
                    currentPage = () => page;
                },
            },
            [svg, name, arrow]
        );
        if (image != null) button.classList.add('forward-button-has-graphic');
        return button;
    };

    // Other components

    theme.radio = (arr, change, activated = 0) => {
        const group = `${Math.random()}`;

        const elements = arr.flatMap((x, i) => {
            const input = $.input.hidden(
                {
                    type: 'radio',
                    value: x,
                    id: `${group}-${i}`,
                    name: group,
                    onchange() {
                        const index = elements.findIndex((x) => x.checked) / 2;
                        container.style.setProperty('--index', index);
                        change(index);
                    },
                },
                []
            );

            if (i === activated) input.checked = true;

            const label = $.label['radio-label']({ htmlFor: `${group}-${i}` }, [x]);

            return [input, label];
        });

        const container = $.div['radio-container'](elements);

        container.style.setProperty('--index', activated);

        return container;
    };

    theme.checkbox = (name, cb, activated = false) => {
        const id = `${Math.random()}`;

        const input = $.input.hidden(
            {
                type: 'checkbox',
                value: name,
                id: id,
                name: id,
                onchange() {
                    cb(input.checked);
                },
            },
            []
        );

        const label = $.label['checkbox-label']({ htmlFor: id }, [name]);

        if (activated) input.checked = true;

        return $.div['checkbox-container']([input, label]);
    };

    theme.seperator = () => $.div.seperator([]);

    theme.error = (e) => {
        throw new Error(e);
    };

    theme.clear = () => {
        interior.innerHTML = '';
        interior.appendChild(rootPage);
    };

    theme.page('root', 'Settings', []);
}

function deactivate() {
    document.querySelectorAll('.insertStyle').forEach((x) => x.remove());
    document.getElementById('container-shadow').remove();
}

export default (epp) =>
    epp.plugin({
        id: 'default-theme',
        name: 'Default Theme',
        description: 'The default theme.',
        dependencies: [],
        hidden: true,
        init: () => {
            epp.themes.push({
                id: 'default-theme',
                activate: () => activate(epp),
                deactivate,
            });
        },
    });
