export default (injector) =>
    injector('core', (c, $, entry, ms, me) => {
        $`${ms('t')}this[${me}${'triggerStart'}] = ${entry('triggerStart')}`;
        c.locations.triggerStart((matches) => {
            console.log('Result:');
            console.log(matches.t);
            return 'foo';
        });
    });
