const buttons = [];

export default (epp) =>
    epp.plugin({
        id: 'mapmerge',
        name: 'Merge Maps',
        dependencies: ['mapfinder'],
        allowReloading: true,
        display(c) {
            this.hide();
            const { theme } = epp;
            const save = theme.button({
                text: 'Save Map',
                hover: 'Saves a map for later use with templates.',
                click: c.setCurrent,
            });
            const applyTemplate = theme.button({
                text: 'Apply Template',
                hover: 'Applies a template to the currently saved map.',
                click: c.setTemplate,
            });
            const sign = theme.button({
                type: 'ghost',
                text: 'Sign for Templating',
                hover: 'Signs this map for templating so others can use it.',
                click: c.sign,
            });
            theme.pages.editor.append(save, applyTemplate, sign);
            buttons.push(save, applyTemplate, sign);
        },
        hide() {
            for (const x of buttons) epp.theme.pages.editor.remove(x);
            buttons.length = 0;
        },
        activate(c, mf) {
            let current;

            function merge(current, template) {
                const name = document.getElementById('pretty_top_name').innerText;
                if (current.m.rxid !== 0) return; // Is Current Edit
                for (const x of template.m.cr) {
                    if (x === name) continue;
                    if (x.startsWith('|')) continue;
                    if (!template.m.cr.contains('|' + x)) return;
                }
                // Update Map to match Current.
                const map = mf.map();
                for (const x of Object.keys(current)) {
                    map[x] = current[x];
                }
                map.m.cr = [...new Set([...template.m.cr.filter((x) => !x.startsWith('|')), ...map.m.cr])];
                const phys = map.physics;
                const mfixturelen = phys.fixtures.length;
                const mbodylen = phys.bodies.length;
                const temp = template.physics;
                phys.bro.push(...temp.bro.map((x) => x + mbodylen));
                phys.bodies.push(
                    ...temp.bodies.map((x) => {
                        x.fx = x.fx.map((a) => (a += mfixturelen));
                        return x;
                    })
                );
                phys.fixtures.push(
                    ...temp.fixtures.map((x) => {
                        x.sh += mfixturelen;
                        return x;
                    })
                );
                phys.shapes.push(...temp.shapes);
                phys.joints.push(
                    ...temp.joints.map((x) => {
                        x.ba += mbodylen;
                        x.bb += x.bb === -1 ? 0 : mbodylen;
                    })
                );
                mf.refresh();
            }
            c.sign = () => {
                const name = document.getElementById('pretty_top_name').innerText;
                const map = mf.map();
                if (map.m.cr.length === 0) map.m.cr.push(name);
                if (!map.m.cr.contains('|' + name)) map.m.cr.push('|' + name);
            };

            c.setCurrent = () => {
                current = JSON.parse(JSON.stringify(mf.map()));
            };

            c.setTemplate = () => {
                if (current == null) return;
                merge(current, JSON.parse(JSON.stringify(mf.map())));
                current = null;
            };
        },
        deactivate(c) {
            c.sign = null;
            c.setCurrent = null;
            c.setTemplate = null;
        },
    });
