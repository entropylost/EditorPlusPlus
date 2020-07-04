export default (epp) =>
    epp.plugin({
        id: 'mapfinder',
        dependencies: [],
        init(c, { defineLocation: $, entry, matchStart: ms, matchEnd: me, regex: _ }) {
            const word = _('\\w+');
            $`${entry('#physicsIntercept')}
            function ${ms('refresh')}${word}${me}(${word}) {
                var ${word}, ${word}, ${word};
                ${word} = ${ms('map')}${word}${me}[${'physics'}][${'bodies'}][${word}];`;
            // function n8Q(r9c) {
            //     var m8c, c9c, l9c;
            //     m8c = f8Q["physics" /*O7J.t63(2306)*/ ]["bodies" /*O7J.w63(3422)*/ ][O8Q];
            c.locations['#physicsIntercept'](
                (m) => `
                epp.plugins.mapfinder.map = () => ${m.map};
                epp.plugins.mapfinder.refresh = (x) => ${m.refresh}(x)`
            );
            $`
                        ${word} = ${word}[${'insertRow'}]();
                        ${word}[${'onclick'}] = function() {${entry('#platformclick')}
                            ${word}.${word}();
                            ${word}(${word}[${'physics'}][${'bro'}][${ms('index')}${word}${me}]);
                            ${word}(${word});
                        };`;
            // I8c = g9Q["insertRow" /*O7J.t63(1937)*/ ]();
            // I8c["onclick" /*O7J.w63(753)*/ ] = function() {
            //     O7J.E7J();
            //     u3c(f8Q["physics" /*O7J.t63(2306)*/ ]["bro" /*O7J.t63(1572)*/ ][X8c]);
            //     L0Q(I8c);
            // };
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
                ${word}[${'clearHighlightSpawn'}]();
                if (${word} == false) {
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
