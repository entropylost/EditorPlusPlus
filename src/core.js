export default (injector) =>
    injector('core', (c, $, entry, ms, me, _) => {
        //$`${ms('t')}this[${me}${'triggerStart'}] = ${entry('triggerStart')}`;
        //c.locations.triggerStart((matches) => {
        //    console.log('Result:');
        //    console.log(matches.t);
        //    return 'foo';
        //});
        const word = _('\\w+');
        $`
            function ${word}(${word}) {
                var ${word}, ${word}, ${word};
                ${word} = ${ms(
            'map'
        )}${word}${me}[${'physics'}][${'bodies'}][${word}];
${entry('#physicsIntercept')}`;
        c.locations['#physicsIntercept']((m) => `window.map = ${m.map};`);
    });
