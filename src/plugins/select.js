let platforms;
let button;
let active = false;
let handler;
let activated = false;

function refreshPlatforms() {
    platforms = document.getElementById('mapeditor_leftbox_platformtable').firstElementChild.children;
}

export default (epp) =>
    epp.plugin({
        id: 'select',
        dependencies: ['map-finder'],
        allowReloading: true,
        display() {
            const { theme } = epp;
            if (button) theme.pages.editor.remove(button);
            button = theme.button({
                type: 'ghost',
                text: 'Toggle Selection',
                toggle: true,
                click: (activated) => {
                    refreshPlatforms();
                    if (!activated) {
                        epp.plugins.select.length = 0;
                        if (platforms != null)
                            for (const x of platforms) {
                                x.classList.remove('platform-selected');
                            }
                    }
                    active = activated;
                },
            });
            theme.pages.editor.append(button);
        },
        hide() {
            const { theme } = epp;
            theme.pages.editor.remove(button);
        },
        activate(c, mf) {
            c.select = [];
            if (!activated) import('./select.styl');
            activated = true;
            handler = (o, n) => {
                if (!active) return;
                refreshPlatforms();
                if (platforms == null) return;
                if (c.select.includes(o)) {
                    platforms[o].classList.add('platform-selected');
                }
                if (active) {
                    c.select.push(n);
                    platforms[n].classList.add('platform-selected');
                }
            };
            mf.onPlatformChange.push(handler);
        },
        deactivate(_, mf) {
            const i = mf.onPlatformChange.indexOf(handler);
            if (i != -1) mf.onPlatformChange.splice(i, 1);
        },
    });
