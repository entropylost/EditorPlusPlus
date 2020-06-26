import { js as jsb } from 'js-beautify/';
import config from './config.json';

import $ from '@implode-nz/html/';
const epp = {};
epp.$ = $;

let loadingFinished = false;

function refreshUI() {
    epp.theme.clear();
    for (let x in plugins) {
        const plugin = plugins[x];
        if (plugin.activated) plugin.display(epp, plugin);
    }
}

function initializeTheme(quickInit = false, forceInit = false) {
    if (quickInit && epp.theme != null) return;
    const id = getStorage('theme');
    let theme = epp.themes.find((x) => x.id === id);
    if ((!quickInit || forceInit) && theme == null) theme = epp.themes[0];
    if (theme == null) return;
    if (epp.theme != null) epp.theme.deactivate();
    epp.theme = {
        id: theme.id,
        activate: theme.activate,
        deactivate: theme.deactivate,
    };
    epp.theme.activate();
    refreshUI();
}

function getStorage(x) {
    return JSON.parse(localStorage.getItem('epp.' + x)) || (config[x] && (setStorage(x, config[x]), config[x]));
}

function setStorage(x, value) {
    localStorage.setItem('epp.' + x, JSON.stringify(value));
}

function refresh() {
    // Requests refresh of page.
    epp.theme.info('Please refresh the page for Editor++ to update.');
    return false;
}

function injectMain(src) {
    let fallback = false;

    let source = src;

    (() => {
        function replace(str, func) {
            let numInstances = 0;
            source = source.replace(new RegExp(str, 'g'), (...args) => {
                numInstances++;
                return func(...args);
            });
            if (numInstances != 1) throw new Error('Invalid regex at:\n' + str);
        }
        try {
            initializeTheme(true, true);
            for (let x in plugins) {
                const plugin = plugins[x];
                if (plugin.type === 'runtime') {
                    if (activatedPlugins[plugin.id]) {
                        plugin.activate();
                    }
                }
            }

            const bundleName = getStorage('bundleName');
            const bundleFunctionAliases = getStorage('bundleFunctionAliases');
            const pairings = getStorage('pairings');

            if (bundleName == null || bundleFunctionAliases == null || pairings == null) {
                fallback = true;
                return false;
            }

            let bundleAliases = [bundleName];

            const inverse = ((obj) => {
                var ne = {};

                for (var prop in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                        ne[obj[prop]] = prop;
                    }
                }

                return ne;
            })(Object.assign({}, pairings));

            const bundleAliasMatcher = new RegExp('var (\\w+) = ' + bundleName + ';', 'g');

            const aliasMatches = [...src.matchAll(bundleAliasMatcher)];

            for (let x of aliasMatches) {
                bundleAliases.push(x[1]);
            }

            const matcher = (str) =>
                '(?:' +
                bundleAliases.join('|') +
                ')' +
                '\\.(?:' +
                bundleFunctionAliases.join('|') +
                ')\\(' +
                inverse[str] +
                '\\)';

            for (const x of matchers) {
                x(matcher, replace);
            }
        } catch (e) {
            console.log(e);
            fallback = true;
        }
    })();

    if (fallback) {
        source =
            src +
            `
setTimeout(window.fallback, 2000);`;

        const bundleDefinitionMatcher = /(\w+)\.(\w+) = \(function\(\) \{/;

        const bundleDefinitionMatch = src.match(bundleDefinitionMatcher);

        const bundleName = bundleDefinitionMatch[1];
        const bundleFunctionDefinition = bundleDefinitionMatch[2];

        setStorage('bundleName', bundleName);

        const bundleFunctionAliases = [];

        [
            ...src.matchAll(
                new RegExp(
                    String.raw`
${bundleName}\.(\w+) = function\(\) \{
    return typeof ${bundleName}\.${bundleFunctionDefinition}\.\w+`,
                    'g'
                )
            ),
        ]
            .slice(0, 2)
            .forEach((arr) => {
                bundleFunctionAliases.push(arr[1]);
            });

        setStorage('bundleFunctionAliases', bundleFunctionAliases);

        const pairings = [];

        window.fallback = () => {
            const bundlePreferredAlias = bundleFunctionAliases[0];

            let i = 0;
            let result = null;
            while ((result = window[bundleName][bundlePreferredAlias](i)) != null) {
                pairings[i] = result;
                i++;
            }

            setStorage('pairings', pairings);

            window.location.reload();
        };
    }

    const s = document.createElement('script');
    s.text = source;
    (document.head || document.documentElement).appendChild(s);
    loadingFinished = true;
}

const plugins = Object.create(null);

epp.plugins = plugins;
epp.themes = [];

const matchers = [];
const delayed = [];

function escape(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const activatedPlugins = getStorage('activatedPlugins');

function plugin(data) {
    if (loadingFinished) throw new Error('Editor++ has finished loading already.');

    const plugin = {
        id: data.id,
        name: data.name,
        description: data.description || 'NO DESCRIPTION',
        dependencies: data.dependencies || [],
        activate: refresh,
        deactivate: refresh,
        display: data.display || (() => {}),
        hidden: data.hidden || false,
        activated: false,
    };
    plugins[data.id] = plugin;

    function activateDependencies(plugin) {
        for (let x of plugin.dependencies) {
            if (plugins[x] == null)
                epp.theme.error(`Can not activate ${plugin.name}, this installation is missing ${x}.`);
            if (plugins[x].type === 'compile' && !plugins[x].activated)
                epp.theme.error(`Can not activate ${plugin.name} as ${x} is not activated`);
            plugins[x].activate();
            activateDependencies(plugins[x]);
        }
    }

    function deactivateDependents(plugin) {
        for (let x in plugins) {
            if (plugins[x].dependencies.includes(plugin.id)) {
                plugins[x].deactivate();
                deactivateDependents(plugins[x]);
            }
        }
    }

    if (data.allowReloading) {
        plugin.type = 'runtime';

        plugin.activate = (...args) => {
            if (plugin.activated) return;
            plugin.activated = true;
            const dep = activateDependencies(plugin);
            args.push(...dep);
            data.activate(...args);
        };
        plugin.deactivate = (...args) => {
            if (!plugin.activated) return;
            plugin.activated = false;
            deactivateDependents(plugin);
            data.deactivate(...args);
        };
    } else if (activatedPlugins[plugin.id]) {
        plugin.type = 'compile';

        const dependencies = plugin.dependencies;
        if (dependencies.length !== 0) {
            let isActivated = false;
            delayed.push(() => {
                if (isActivated) return;
                for (const x of dependencies) {
                    if (plugins[x] == null) return;
                }
                isActivated = true;
                injector(
                    plugin,
                    data.init,
                    dependencies.map((x) => plugins[x])
                );
            });
            delayed.forEach((x) => x());
        }
        injector(plugin, data.init);
        initializeTheme(true);
    }
    delayed.forEach((x) => x());
}

function injector(plugin, f, extra = []) {
    if (plugin.activated) return;
    plugin.activated = true;
    plugin.locations = Object.create(null);
    function entry(name) {
        const computed = [];
        plugin.locations[name] = (x) => {
            computed.push(x);
        };
        return (...args) => computed.map((x) => x(...args)).join('\n');
    }
    function matchStart(name) {
        if (typeof name !== 'string') throw new Error('Invalid Name');
        return {
            type: 'matchStart',
            name: name,
        };
    }
    const matchEnd = {
        type: 'matchEnd',
    };
    function regex(text) {
        return {
            type: 'regex',
            data: text,
        };
    }
    function defineLocation(escape, strings, ...values) {
        matchers.push((matchStr, replace) => {
            let capIndex = 0;
            let str = '(' + escape(strings.raw[0]);
            let isWithinMatch = false;
            const nameMatch = [];
            const entries = [];
            for (let i = 0; i < values.length; i++) {
                const v = values[i];
                switch (typeof v) {
                    case 'string':
                        str += matchStr(v);
                        break;
                    case 'function':
                        capIndex++;
                        str += ')(';
                        entries[capIndex] = v;
                        break;
                    case 'object':
                        if (v.type === 'matchStart') {
                            if (isWithinMatch)
                                throw new Error(
                                    'Can not use matchStart while the amount of matchStarts is greater than the amount of matchEnds'
                                );
                            capIndex++;
                            str += ')(';
                            nameMatch[capIndex] = v.name;
                            isWithinMatch = true;
                        } else if (v.type === 'matchEnd') {
                            if (!isWithinMatch) throw new Error('Can not use matchEnd without first using matchStart');
                            capIndex++;
                            str += ')(';
                            isWithinMatch = false;
                        } else if (v.type === 'regex') {
                            str += v.data;
                        } else throw new Error('Invalid Type.');
                        break;
                }
                str += escape(strings.raw[i + 1]);
            }
            str += ')';
            return replace(str, (_, ...args) => {
                const matches = Object.create(null);
                for (let i = 0; i < args.length - 2; i++) if (nameMatch[i] != null) matches[nameMatch[i]] = args[i];
                let res = args[0];
                for (let i = 1; i < args.length - 2; i++) {
                    if (entries[i] != null) res += entries[i](matches);
                    res += args[i];
                }
                return res;
            });
        });
    }
    const defineLocationString = (strings, ...values) => defineLocation(escape, strings, ...values);
    const defineLocationRegex = (strings, ...values) => defineLocation((x) => x, strings, ...values);
    defineLocationString.re = defineLocationRegex;
    f(epp, plugin, ...extra, defineLocationString, entry, matchStart, matchEnd, regex);
    if (plugin.activated && epp.theme != null) {
        plugin.display(epp, plugin);
    }
}

epp.plugin = plugin;

window.epp = epp;

function inject() {
    fetch(config.alphaLocation)
        .then((res) => res.text())
        .then((alpha) => injectMain(jsb(alpha)));
}

inject();

import core from './core';
import defaultTheme from './default.theme';

core(epp);
defaultTheme(epp);
