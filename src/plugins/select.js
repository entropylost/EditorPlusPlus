let platforms;

function refreshPlatforms() {
    platforms = document.getElementById('mapeditor_leftbox_platformtable').firstElementChild.children;
}

export default (epp) =>
    epp.plugin({
        id: 'select',
        hidden: true,
        dependencies: ['mapfinder'],
        init(c, mf) {
            c.select = [];
            import('./select.styl');
            mf.locations.platformclick(
                (m) => `
if (epp && epp.plugins && epp.plugins.select) {
    if (arguments[0].shiftKey) {
        epp.plugins.select.update(${m.index});
    } else {
        epp.plugins.select.disable(${m.index});
    }
}
                `
            );
            c.update = (n) => {
                const o = mf.lastPlatformIndex;
                if (o == null) c.disable();
                refreshPlatforms();
                if (platforms == null) return;
                c.select = c.select.filter((x) => x !== n);
                c.select.push(n);
                platforms[n].classList.add('platform-selected');
                if (c.select.includes(o)) {
                    platforms[o].classList.add('platform-selected');
                }
            };
            c.disable = (i) => {
                c.select = [];
                if (platforms != null)
                    for (const x of platforms) {
                        x.classList.remove('platform-selected');
                    }
                if (i != null) c.select.push(i);
            };
        },
    });
