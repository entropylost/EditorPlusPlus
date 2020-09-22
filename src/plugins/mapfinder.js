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

            c.refresh = () => {
                document.getElementById('mapeditor_close').click();
                document.getElementById('newbonklobby_editorbutton').click();
            };

            $`${entry('#physicsIntercept')}
            function ${ms('refresh')}${word}${me}(${word}) {${entry('#beforeRefresh')}
                var ${word} = [arguments];
                ${arrAccess} = ${ms('map')}${arrAccess}${me}[${'physics'}][${'bodies'}][${arrAccess}];`;
            // function A4h(b96) {
            //     var g0a = [arguments];
            //     g0a[8] = o9a[2]["physics" /*v5y.c25(856)*/ ]["bodies" /*v5y.c25(10)*/ ][o9a[47]];

            c.locations['#physicsIntercept'](
                (m) => `
                epp.plugins.mapfinder.map = () => ${m.map};`
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
                        ${arrAccess}[${'onclick'}] = function() {${entry('platformclick')}
                            ${word}(${arrAccess}[${'physics'}][${'bro'}][${ms('index')}${argsAccess}${me}]);`;
            //            N8Q[8] = z0Q[76]["insertRow" /*h22.Z45(2566)*/ ]();
            //            N8Q[8]["onclick" /*h22.e45(2069)*/ ] = function() {
            //                h22.M22();
            //                W3o(z0Q[5]["physics" /*h22.Z45(700)*/ ]["bro" /*h22.Z45(2535)*/ ][N8Q[0][0]]);

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
                ${arrAccess}[${'clearHighlightPlatform'}]();
                ${line}
                ${line}
                    ${ms('redraw')}${word}${me}`;

            //     F3h[31]["clearHighlightSpawn" /*A2E.g9m(1059)*/ ]();
            //     if (F3h[19] == false) {
            //         j3h[6] = 1441676794;
            //         j3h[5] = -1296317008;
            //         j3h[3] = 2;
            //         for (j3h[7] = 1; A2E.n6D(j3h[7].toString(), j3h[7].toString().length, 14145) !== j3h[6]; j3h[7]++) {
            //             L6M(false);
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
