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

    theme.radio = (arr, change, activated = 0) => {
        const group = `${Math.random()}`;

        const elements = arr.flatMap((x, i) => {
            const input = $.input['hidden-radio'](
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

            label.style.cssText = `--index: ${i}`;

            return [input, label];
        });

        const container = $.div['radio-container'](elements);

        container.style.setProperty('--index', activated);

        return container;
    };

    theme.error = (e) => {
        throw new Error(e);
    };

    let rootPage = null;
    let currentPage = () => rootPage;
    let pages = [];

    theme.page = (name, elements, root = false) => {
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
                            page.classList.remove('page-in');
                            page.classList.add('page-out');
                            old.classList.remove('page-out');
                            old.classList.add('page-in');
                            currentPage = () => old;
                        }
                    },
                },
                $.div['back-arrow']([])
            );

            pageTitle = $.div['page-title']([back, name]);
        }

        const pageInterior = $.div['page-interior'](elements);

        const page = $.div.page(pageTitle == null ? pageInterior : [pageTitle, pageInterior]);

        if (root) {
            rootPage = page;
            if (pages.length === 0) page.classList.add('page-in');
        }

        interior.appendChild(page);
    };

    theme.clear = () => (interior.innerHTML = '');

    setTimeout(() => epp.theme.page('Foo', [], true), 5000);
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
        init: () => {
            epp.themes.push({
                id: 'default-theme',
                activate: () => activate(epp),
                deactivate,
            });
        },
    });
