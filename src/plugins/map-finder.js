export default (epp) =>
    epp.plugin({
        id: 'map-finder',
        dependencies: [],
        init(epp, c, { defineLocation: $, entry, matchStart: ms, matchEnd: me, regex: _ }) {
            const word = _('\\w+');
            $`${entry('#physicsIntercept')}
            function ${word}(${word}) {
                var ${word}, ${word}, ${word};
                ${word} = ${ms('map')}${word}${me}[${'physics'}][${'bodies'}][${word}];`;
            // function n8Q(r9c) {
            //     var m8c, c9c, l9c;
            //     m8c = f8Q["physics" /*O7J.t63(2306)*/ ]["bodies" /*O7J.w63(3422)*/ ][O8Q];
            c.locations['#physicsIntercept']((m) => `epp.edit = (f) => ${m.map} = f(${m.map});`);
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
epp.onPlatformChange.forEach((f) => f(epp.currentPlatformIndex, ${m.index}));
epp.currentPlatformIndex = ${m.index};`
            );
            epp.onPlatformChange = [console.log];
        },
    });
