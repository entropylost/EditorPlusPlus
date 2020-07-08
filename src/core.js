function initialize(epp) {
    const { $ } = epp;

    import('./core.styl');

    (() => {
        function call() {
            const b2Header = document.getElementById('bonkioheader');
            const cr = document.getElementById('cpms_r');
            if (b2Header == null || cr == null) return false;
            cr.parentNode.removeChild(cr);
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
    }, 3000);
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
            const root = theme.pages.root;

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

            if (theme.pages.plugins == null) {
                const plugins = theme.page('plugins', 'Plugins', elements);
                const current = theme.next('Plugins', plugins);
                buttons.push(current);
                root.append(current);
            } else {
                theme.pages.plugins.clear();
                theme.pages.plugins.append(...elements);
            }

            if (theme.pages.editor == null) {
                const editor = theme.page('editor', 'Editor Menu', []);
                const current = theme.next('Editor Menu', editor);
                buttons.push(current);
                root.append(current);
            } else {
                theme.pages.editor.clear();
            }

            if (theme.pages.advanced == null) {
                const advanced = theme.page('advanced', 'Advanced', []);
                const current = theme.next('Advanced', advanced);
                buttons.push(current);
                root.append(current);
            } else {
                theme.pages.advanced.clear();
            }

            if (theme.pages.changelog == null) {
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
                        click: () => window.open(epp.discord),
                    }),
                    theme.toggle('Hello', () => {}),
                ];
                root.append(...elements);
                buttons.push(...elements);
            }
        },
        hide() {
            const { theme } = epp;
            buttons.forEach((current) => theme.pages.root.remove(current));
            ['plugins', 'editor', 'advanced', 'changelog'].forEach((x) => epp.theme.pages[x].destroy());
        },
    });
