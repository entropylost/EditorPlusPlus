let merge;

export default (epp) =>
    epp.plugin({
        id: 'merge',
        name: 'Merge Platforms',
        dependencies: ['select', 'mapfinder'],
        allowReloading: true,
        display(c) {
            this.hide();
            const { theme } = epp;
            merge = theme.button({
                type: 'ghost',
                text: 'Merge Platforms',
                click: c.merge,
            });
            theme.pages.editor.append(merge);
        },
        hide() {
            const { theme } = epp;
            if (merge == null) return;
            theme.pages.editor.remove(merge);
            merge = null;
        },
        activate(c, sel, mf) {
            console.log(arguments);
            c.merge = () => {
                if (mf.map == null) return;
                const map = mf.map();
                const select = sel.select;
                const t = select[select.length - 1];
                const f = select.slice(0, select.length - 1);
                const root = map.physics.bodies[map.physics.bro[t]];
                const indexies = f.map((x) => map.physics.bro[x]);
                for (const x of indexies) {
                    const body = map.physics.bodies[x];
                    root.fx.push(...body.fx);
                    map.physics.bodies[x].fx = [];
                }
                mf.refresh();
                const platforms = document.getElementById('mapeditor_leftbox_platformtable').firstElementChild.children;
                if (platforms == null) return;
                f.concat()
                    .sort()
                    .forEach((x, i) => {
                        const platform = platforms[x - i];
                        platform.click();
                        const del = document.getElementById('mapeditor_leftbox_deletebutton');
                        del.click();
                        del.click();
                    });
            };
        },
        deactivate(c) {
            c.merge = null;
        },
    });
