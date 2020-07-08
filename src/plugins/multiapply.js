let handler;
let platformChangeHandler;

export default (epp) =>
    epp.plugin({
        id: 'multiapply',
        dependencies: ['select', 'mapfinder'],
        allowReloading: true,
        display(c) {
            c.hide();
            const names = {
                number: ['Numbers:', 'Numeric values such as density, friction, and position.'],
                boolean: ['Booleans:', 'Values which are either on or off (friction, collide with).'],
            };
            for (const [k, v] of Object.entries(c.modes)) {
                const r = epp.theme.toggle(names[k][0], (active) => {
                    
                }, true, names[k][1]);
                r.classList.add('multiapplyoption');
                epp.theme.pages.editor.append(r);
            }
        },
        hide() {
            document.querySelectorAll('.multiapplyoption').forEach((x) => x.parentNode.removeChild(x));
        },
        activate(c, sel, mf) {
            const none = {
                name: 'None',
                from: () => {},
                to(diff, previous) {
                    return previous;
                },
            };

            const numberModes = [
                none,
                {
                    name: 'Add',
                    from(current, previous) {
                        return current - previous;
                    },
                    to(diff, previous) {
                        return diff + previous;
                    },
                },
            ];
            const xor = (a, b) => a !== b;
            const booleanModes = [
                none,
                {
                    name: 'Xor',
                    from: xor,
                    to: xor,
                },
            ];
            c.modes = {
                number: numberModes,
                boolean: booleanModes,
            };

            c.mode = {
                number: numberModes[1],
                boolean: booleanModes[1],
            };

            const disallowed = { n: true, fx: true };
            function initIndex(index) {
                if (index == null) return;
                const bindex = mf.map().physics.bro[index];
                let last = JSON.parse(JSON.stringify(mf.map().physics.bodies[bindex]));
                handler = () => {
                    if (!sel.select.includes(index)) return;
                    const next = mf.map().physics.bodies[bindex];
                    function difference(o, n, tl = false) {
                        if (Array.isArray(n)) {
                            let isUndef = true;
                            const res = n.map((x, i) => {
                                const r = difference(o[i], x);
                                if (r != null) isUndef = false;
                                return r;
                            });
                            if (isUndef) return undefined;
                            return res;
                        }
                        if (typeof n === 'object') {
                            const d = {};
                            let isUndef = true;
                            for (const [k, v] of Object.entries(n)) {
                                if (tl && disallowed[k]) continue;
                                d[k] = difference(o[k], v);
                                if (d[k] != null) isUndef = false;
                            }
                            if (isUndef) return undefined;
                            return d;
                        }
                        if (o === n) return undefined;
                        return c.mode[typeof n].from(o, n);
                    }
                    const diff = difference(next, last);
                    let hasDiffed = false;
                    function diffAllKeys(diff, out, key) {
                        const value = out[key];
                        if (diff === undefined) return;
                        if (Array.isArray(value)) {
                            return value.forEach((x, i) => diffAllKeys(diff[i], value, i));
                        }
                        if (typeof value === 'object') {
                            for (const key of Object.keys(diff)) {
                                diffAllKeys(diff[key], value, key);
                            }
                            return;
                        }
                        out[key] = c.mode[typeof value].to(diff, value);
                        hasDiffed = true;
                    }
                    for (const i of sel.select) {
                        if (i === index) continue;
                        const bi = mf.map().physics.bro[i];
                        diffAllKeys(diff, mf.map().physics.bodies, bi);
                    }
                    if (hasDiffed) mf.redraw();
                    last = JSON.parse(JSON.stringify(next));
                };
                mf.onRedraw.push(handler);
            }
            function removeHandler() {
                const index = mf.onRedraw.indexOf(handler);
                if (index !== -1) mf.onRedraw.splice(index, 1);
            }
            c.disable = () => {
                const i = mf.onPlatformChange.indexOf(platformChangeHandler);
                if (i !== -1) mf.onPlatformChange.splice(i, 1);
                removeHandler();
            };

            platformChangeHandler = (o, n) => {
                removeHandler();
                initIndex(n);
            };

            mf.onPlatformChange.push(platformChangeHandler);
        },
        deactivate(c) {
            c.disable();
            c.modes = null;
            c.mode = null;
        },
    });
