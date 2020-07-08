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
        epp.plugins.select.disable();
    }
}
                `
            );
            c.update = (n) => {
                if (mf.lastPlatformIndex == null) c.disable();
                const o = mf.lastPlatformIndex;
                refreshPlatforms();
                if (platforms == null) return;
                if (!c.select.includes(n)) {
                    c.select.push(n);
                    platforms[n].classList.add('platform-selected');
                }
                if (o != null && !c.select.includes(o)) {
                    c.select.push(o);
                    platforms[o].classList.add('platform-selected');
                }
            };
            c.disable = () => {
                c.select = [];
                if (platforms != null)
                    for (const x of platforms) {
                        x.classList.remove('platform-selected');
                    }
            };
        },
    });
