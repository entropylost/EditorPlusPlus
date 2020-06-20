import init from './init';

export default (injector) =>
    injector('core', (c, $, entry, ms, me, _) => {
        const word = _('\\w+');
        $`${entry('#physicsIntercept')}
            function ${word}(${word}) {
                var ${word}, ${word}, ${word};
                ${word} = ${ms('map')}${word}${me}[${'physics'}][${'bodies'}][${word}];`;

        c.locations['#physicsIntercept']((m) => `epp.edit = (f) => ${m.map} = f(${m.map});`);
        $`
                    ${word} = function(${ms('index')}${word}${me}) {
                        var ${word}, ${word}, ${word}, ${word};
                        ${word} = ${word}[${'insertRow'}]();
                        ${word}[${'onclick'}] = function() {${entry('#platformclick')}
                            ${word}(${word}[${'physics'}][${'bro'}][${word}]);
                            ${word}.${word}();
                            ${word}(${word});`;
        c.locations['#platformclick'](
            (m) => `
if (epp.onPlatformChange != null) epp.onPlatformChange(epp.currentPlatformIndex, ${m.index});
epp.currentPlatformIndex = ${m.index};`
        );
    })(init);
