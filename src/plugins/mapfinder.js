export default (epp) =>
    epp.plugin({
        id: 'mapfinder',
        dependencies: [],
        init(c, { defineLocation: $, entry, matchStart: ms, matchEnd: me, regex: _ }) {
            const word = _('\\w+');
            const wordsWithCommas = _('(?:\\w+, )*\\w+');
            const line = _('[^\\n]+');
            const arrAccess = _('\\w+\\[\\d+\\]');
            const argsAccess = _('\\w+\\[0\\]\\[\\d+\\]');

            $`${entry('#physicsIntercept')}
            function ${ms('refresh')}${word}${me}(${word}) {
                var ${word} = [arguments];
                ${arrAccess} = ${ms('map')}${arrAccess}${me}[${'physics'}][${'bodies'}][${arrAccess}];`;
            /*
            function ${ms('refresh')}${word}${me}(${word}) {
                var ${word}, ${word}, ${word};
                ${word} = ${ms('map')}${word}${me}[${'physics'}][${'bodies'}][${word}];`;
            */

            c.locations['#physicsIntercept'](
                (m) => `
                epp.plugins.mapfinder.map = () => ${m.map};
                epp.plugins.mapfinder.refresh = (x) => ${m.refresh}(x)`
            );
            $`
                        ${arrAccess} = ${arrAccess}[${'insertRow'}]();
${line}
                        ${arrAccess}[${'onclick'}] = function() {${entry('#platformclick')}
                            var ${word} = [arguments];
                            ${word}(${arrAccess}[${'physics'}][${'bro'}][${ms('index')}${argsAccess}${me}]);`;
            // n1a[1] = o9a[86]["insertRow" /*v5y.c25(2357)*/ ]();
            // v5y.C5y();
            // n1a[1]["onclick" /*v5y.d25(1772)*/ ] = function() {
            //     var X1a = [arguments];
            //     i0Y(o9a[2]["physics" /*v5y.c25(856)*/ ]["bro" /*v5y.d25(3405)*/ ][n1a[0][0]]);

            c.locations['#platformclick'](
                (m) => `
if (epp != null && epp.plugins != null && epp.plugins.mapfinder != null) {
    if (Array.isArray(epp.plugins.mapfinder.onPlatformChange)) epp.plugins.mapfinder.onPlatformChange.forEach((f) => f(epp.plugins.mapfinder.currentPlatformIndex, ${m.index}));
    epp.plugins.mapfinder.currentPlatformIndex = ${m.index};
}`
            );
            c.onPlatformChange = [console.log];

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
            c.onRedraw = [console.log];
        },
    });