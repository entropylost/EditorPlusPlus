function initialize() {
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
        init: initialize,
        hidden: true,
        display(epp) {
            const { theme } = epp;
            const root = theme.pages.root;

            if (theme.pages.plugins != null) {
                theme.pages.plugins.clear();
            }

            const elements = [];

            for (const x in epp.plugins) {
                const plugin = epp.plugins[x];
                if (plugin.hidden) continue;
                elements.push(
                    theme.checkbox(
                        plugin.name,
                        () => {
                            if (plugin.activated) {
                                plugin.deactivate();
                            } else plugin.activate();
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
                theme.pages.plugins.append(...elements);
            }
        },
        hide(epp) {
            const { theme } = epp;
            buttons.forEach((current) => theme.pages.root.remove(current));
            theme.pages.plugins.destroy();
        },
    });
