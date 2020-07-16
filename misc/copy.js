// ==UserScript==
// @name  Copy
// @match *://bonk2.io/*
// @run-at document-start
// @grant none
// ==/UserScript==

let text = '';

(() => {
    const buttons = [];
    window.eppPlugins = window.eppPlugins || [];
    window.eppPlugins.push((epp) =>
        epp.plugin({
            id: 'copy',
            name: 'Map Copy',
            dependencies: ['mapfinder'],
            allowReloading: true,
            display(c) {
                this.hide();
                const { theme } = epp;
                const copy = theme.button({
                    type: 'ghost',
                    text: 'Copy Map',
                    click: c.copy,
                });
                buttons.push(copy);
                theme.pages.editor.append(copy);
                const paste = theme.button({
                    type: 'ghost',
                    text: 'Paste Map',
                    click: c.paste,
                });
                buttons.push(paste);
                theme.pages.editor.append(paste);
            },
            hide() {
                const { theme } = epp;
                for (const x of buttons) {
                    theme.pages.editor.remove(x);
                }
                buttons.length = 0;
            },
            activate(c, mf) {
                const values = ['physics', 'spawns', 'capZones'];
                c.copy = () => {
                    text = JSON.stringify(mf.map());
                };

                c.paste = () => {
                    try {
                        const copied = JSON.parse(text);
                        const map = mf.map();
                        for (const x of values) {
                            map[x] = JSON.parse(JSON.stringify(copied[x]));
                        }
                        mf.refresh();
                    } catch (e) {
                        epp.theme.info('Can not paste map; invalid text in clipboard.');
                    }
                };
            },
            deactivate(c) {
                c.copy = null;
                c.paste = null;
            },
        })
    );
})();
