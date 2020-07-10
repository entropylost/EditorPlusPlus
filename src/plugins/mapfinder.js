export default (epp) =>
    epp.plugin({
        id: 'mapfinder',
        hidden: true,
        dependencies: [],
        init(c, { defineLocation: $, entry, matchStart: ms, matchEnd: me }) {
            const word = /\w+/;
            const line = /[^\n]+/;
            const arrAccess = /\w+\[\d+\]/;
            const argsAccess = /\w+\[0\]\[\d+\]/;

            c.lastInitValid = false;

            $`${entry('#physicsIntercept')}
            function ${ms('refresh')}${word}${me}(${word}) {${entry('#beforeRefresh')}
                var ${word} = [arguments];
                ${arrAccess} = ${ms('map')}${arrAccess}${me}[${'physics'}][${'bodies'}][${arrAccess}];`;
            // function A4h(b96) {
            //     var g0a = [arguments];
            //     g0a[8] = o9a[2]["physics" /*v5y.c25(856)*/ ]["bodies" /*v5y.c25(10)*/ ][o9a[47]];

            c.locations['#physicsIntercept'](
                (m) => `
                epp.plugins.mapfinder.map = () => ${m.map};
                epp.plugins.mapfinder.refresh = (x) => ${m.refresh}(x)`
            );
            c.locations['#beforeRefresh'](
                () => `
if (epp != null && epp.plugins != null && epp.plugins.mapfinder != null) {
    if (!epp.plugins.mapfinder.lastInitValid) {
        if (Array.isArray(epp.plugins.mapfinder.onPlatformChange))
            epp.plugins.mapfinder.onPlatformChange.forEach((f) => f(epp.plugins.mapfinder.currentPlatformIndex, undefined));
        epp.plugins.mapfinder.currentPlatformIndex = undefined;
        epp.plugins.mapfinder.lastPlatformIndex = undefined;
    }
    epp.plugins.mapfinder.lastInitValid = false;
}`
            );
            $`
                        ${arrAccess} = ${arrAccess}[${'insertRow'}]();
${line}
                        ${arrAccess}[${'onclick'}] = function() {${entry('platformclick')}
                            var ${word} = [arguments];
                            ${word}(${arrAccess}[${'physics'}][${'bro'}][${ms('index')}${argsAccess}${me}]);`;
            // n1a[1] = o9a[86]["insertRow" /*v5y.c25(2357)*/ ]();
            // v5y.C5y();
            // n1a[1]["onclick" /*v5y.d25(1772)*/ ] = function() {
            //     var X1a = [arguments];
            //     i0Y(o9a[2]["physics" /*v5y.c25(856)*/ ]["bro" /*v5y.d25(3405)*/ ][n1a[0][0]]);

            c.locations.platformclick(
                (m) => `
if (epp != null && epp.plugins != null && epp.plugins.mapfinder != null) {
    epp.plugins.mapfinder.lastInitValid = true;
    if (Array.isArray(epp.plugins.mapfinder.onPlatformChange)) epp.plugins.mapfinder.onPlatformChange.forEach((f) => f(epp.plugins.mapfinder.currentPlatformIndex, ${m.index}));
    epp.plugins.mapfinder.lastPlatformIndex = epp.plugins.mapfinder.currentPlatformIndex;
    epp.plugins.mapfinder.currentPlatformIndex = ${m.index};
}`
            );
            c.onPlatformChange = [];

            $`${entry('#redraw')}
            function ${word}() {
                ${arrAccess}[${'clearHighlightSpawn'}]();
                if (${arrAccess} == false) {
                    ${ms('redraw')}${word}${me}(true);
                }
            }`;
            // function w3c() {
            //     x8Q["clearHighlightSpawn" /*O7J.w63(132)*/ ]();
            //     if (u8Q == false) {
            //         U8Q(true);
            //     }
            // }
            c.locations['#redraw'](
                (m) => `
let trueRedraw;
epp.plugins.mapfinder.redraw = () => trueRedraw(true);
setTimeout(() => {
    trueRedraw = ${m.redraw};
    ${m.redraw} = (x) => {
        trueRedraw(x);
        if (x) epp.plugins.mapfinder.onRedraw.forEach(a => a());
    }
}, 0);`
            );
            c.onRedraw = [];
        },
    });
