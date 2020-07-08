function initialize(epp) {
    const { $ } = epp;

    import('./core.styl');

    (() => {
        function call() {
            const b2Header = document.getElementById('bonkioheader');
            if (b2Header == null) return false;
            b2Header.append(
                $.a(
                    'epp-header',
                    {
                        href: epp.discord,
                        target: '_blank',
                    },
                    [$.span('epp-header-left', ['Editor++']), $.span('epp-header-right', [epp.version])]
                )
            );
            setTimeout(() => {
                b2Header.style.fontSize = '16px';
                setTimeout(() => (b2Header.style.fontSize = '17px'), 250);
            }, 250);
            return true;
        }
        const a = setInterval(() => {
            if (call()) clearInterval(a);
        }, 1000);
    })();

    setTimeout(() => {
        const c = 'font-size: large;';
        const c1 = c + 'background-color: #282c34; color: white;';
        const c2 = c + 'background-color: black; color: #DDD;';
        let cls = [];
        for (let i = 0; i < 12; i++) {
            cls = cls.concat([c2, c1]);
        }
        console.log(
            String.raw`%c
                    %c                                     %c
  /==============   %c                                     %c
  ||/============   %c                                     %c
  |||     |||       %c         Editor++                    %c
  |||     |||       %c                                     %c
  ||\===========    %c        Made by ReversedGravity.     %c
  ||/===========    %c                                     %c
  |||     |||       %c        Email: rg@youxplode.com      %c
  |||     |||       %c        Discord: iMplode-nZ#5773     %c
  ||\============   %c                                     %c
  \==============   %c                                     %c
                    %c                                     %c
`,
            c1,
            ...cls
        );
        if (epp.getStorage('core.firstInstall', true)) {
            alert(
                `Welcome to Editor++! Please note that Editor++ is currently a work in progress and there may be bugs.\
 If you find any, feel free to report them.`
            );
            epp.setStorage('core.firstInstall', false);
        }
    }, 5000);
}

const buttons = [];

export default (epp) =>
    epp.plugin({
        id: 'core',
        name: 'core',
        description: 'The base module. Do not deactivate.',
        dependencies: [],
        init: () => initialize(epp),
        hidden: true,
        display() {
            const { theme, $ } = epp;
            const { pages } = theme;
            const root = pages.root;

            const elements = [];

            for (const x in epp.plugins) {
                const plugin = epp.plugins[x];
                if (plugin.hidden) continue;
                elements.push(
                    theme.checkbox(
                        plugin.name,
                        (x) => {
                            if (x) {
                                plugin.activate();
                            } else plugin.deactivate();
                        },
                        plugin.activated
                    )
                );
            }

            if (pages.plugins == null) {
                const plugins = theme.page('plugins', 'Plugins', elements);
                const current = theme.next('Plugins', plugins);
                buttons.push(current);
                root.append(current);
            } else {
                pages.plugins.clear();
                pages.plugins.append(...elements);
            }

            if (pages.editor == null) {
                const editor = theme.page('editor', 'Editor Menu', []);
                const current = theme.next('Editor Menu', editor);
                buttons.push(current);
                root.append(current);
            } else {
                pages.editor.clear();
                pages.editor.append(
                    $.div(
                        { style: 'text-indent: 0.5em; padding-left: 0.5em' },
                        'Sorry, this part of Editor++ has not been made yet. Please contact me via discord if you have a feature you wish to insert here.'
                    )
                );
            }

            if (pages.advanced == null) {
                const advanced = theme.page('advanced', 'Advanced', []);
                const current = theme.next('Advanced Settings', advanced);
                buttons.push(current);
                root.append(current);
            } else {
                pages.advanced.clear();
            }

            if (pages.changelog == null) {
                const cls = epp.changelog.map(([ver, txt]) =>
                    $.div['epp-changelog']([
                        $.div['epp-changelog-version']([`Version ${ver}`]),
                        $.div['epp-changelog-text']([txt]),
                    ])
                );
                const changelog = theme.page('changelog', 'Changelog', cls);
                const elements = [
                    theme.seperator(),
                    theme.next('Changelog', changelog),
                    theme.button({
                        type: 'ternary',
                        text: 'Discord',
                        ternary: '#999999',
                        secondary: '#171F27',
                        click: () => window.open(epp.discord),
                    }),
                ];
                root.append(...elements);
                buttons.push(...elements);
            }
        },
        hide() {
            const pages = epp.theme.pages;
            buttons.forEach((current) => pages.root.remove(current));
            ['plugins', 'editor', 'advanced', 'changelog'].forEach((x) => pages[x].destroy());
        },
    });
