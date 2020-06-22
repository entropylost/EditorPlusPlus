function activate(epp) {
    const { $, theme } = epp;
    import('./index.styl');
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
    interior.innerHTML =
        '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus</p>';
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
                    id: `${group}-${x}`,
                    name: group,
                    onchange: () => {
                        const index = elements.findIndex((x) => x.checked) / 2;
                        container.style.setProperty('--index', index);
                        change(index);
                    },
                },
                []
            );

            if (i === activated) input.checked = true;

            const label = $.label['radio-label']({ htmlFor: `${group}-${x}` }, [x]);

            label.style.cssText = `--index: ${i}`;

            return [input, label];
        });


        const container = $.div['radio-container'](elements);

        container.style.setProperty('--index', activated);

        return container;
    };

    interior.appendChild(theme.radio(['foo', 'bar', 'baz'], console.log));
}

function deactivate() {
    document.querySelectorAll('.insertStyle').forEach((x) => x.remove());
    document.getElementById('container-shadow').remove();
}

export default (epp) =>
    epp.plugin({
        name: 'default-theme',
        description: 'The default theme.',
        dependencies: [],
        init: () => {
            epp.themes.push({
                name: 'default-theme',
                activate: () => activate(epp),
                deactivate,
            });
        },
    });
