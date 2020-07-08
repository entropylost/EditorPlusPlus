import { js as jsb } from 'js-beautify/';
import config from './config.json';

import $ from '@implode-nz/html/';
const epp = {};
epp.$ = $;

import { version } from '../manifest.json';
epp.version = `v${version}`;
epp.discord = 'https://discord.gg/GCz7KgG';
epp.changelog = [
    [
        '0.5.0',
        `Moved complicated settings to Advanced tab.\
 Added new feature: Polygon Editing.\
 Select works by shift-clicking.`,
    ],
];

let loadingFinished = false;

function refreshUI() {
    epp.theme.clear();
    for (let x in plugins) {
        const plugin = plugins[x];
        if (plugin.activated) plugin.display(plugin);
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

epp.getStorage = getStorage;

function setStorage(x, value) {
    localStorage.setItem('epp.' + x, JSON.stringify(value));
}

epp.setStorage = setStorage;

function refresh() {
    // Requests refresh of page.
    epp.theme.info('Please refresh the page for Editor++ to update plugins.');
    return false;
}

function scanSource(src) {
    const bundleDefinitionMatcher = /(\w+)\.(\w+) = \(function\(\) \{/;

    const bundleDefinitionMatch = src.match(bundleDefinitionMatcher);

    const bundleName = bundleDefinitionMatch[1];
    const bundleFunctionDefinition = bundleDefinitionMatch[2];

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

    return { bundleName, bundleFunctionAliases };
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
            if (numInstances !== 1) throw new Error('Invalid regex at:\n' + str);
        }

        try {
            const bundleName = getStorage('bundleName');
            const bundleFunctionAliases = getStorage('bundleFunctionAliases');
            const pairings = getStorage('pairings');

            const test = scanSource(src);
            if (
                bundleName !== test.bundleName ||
                JSON.stringify(bundleFunctionAliases) !== JSON.stringify(test.bundleFunctionAliases) ||
                pairings == null
            ) {
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

            initializeTheme(true, true);
            for (let x in plugins) {
                const plugin = plugins[x];
                if (plugin.type === 'runtime') {
                    if (activatedPlugins[plugin.id]) {
                        plugin.activate(true);
                    }
                }
            }
            for (let x in plugins) {
                const plugin = plugins[x];
                if (plugin.activated) plugin.display(plugin);
            }
        } catch (e) {
            console.log(e);
            alert(
                `Editor++ does not work, please disable it.
If this error message appears not because of a bonk2.io update, please inform us of this bug via discord (${epp.discord}) or email (rg@youxplode.com).`
            );
        }
    })();

    if (fallback) {
        const { bundleName, bundleFunctionAliases } = scanSource(src);

        setStorage('bundleName', bundleName);
        setStorage('bundleFunctionAliases', bundleFunctionAliases);

        source =
            src +
            `
setTimeout(window.fallback, 2000);`;

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

    if (plugins[data.id]) return;

    const plugin = {
        id: data.id,
        name: data.name || data.id,
        description: data.description || 'NO DESCRIPTION',
        dependencies: data.dependencies || [],
        activate() {
            if (plugin.activated) return;
            setPluginActivate(true);
            refresh();
        },
        deactivate() {
            if (!plugin.activated) return;
            setPluginActivate(false);
            refresh();
        },
        display: data.display || (() => {}),
        hide: data.hide || (() => {}),
        hidden: data.hidden || false,
        activated: false,
        type: 'compile',
    };
    plugins[data.id] = plugin;

    function setPluginActivate(value = true) {
        plugin.activated = value;
        activatedPlugins[plugin.id] = value;
        setStorage('activatedPlugins', activatedPlugins);
    }

    function activateDependencies(plugin) {
        if (plugin.type === 'compile') throw new Error('Invalid Plugin Activated');
        const dep = [];
        for (let x of plugin.dependencies) {
            if (plugins[x] == null) return `Can not activate ${plugin.name}, this installation is missing ${x}.`;
            if (plugins[x].type === 'compile') {
                if (!plugins[x].activated) return `Can not activate ${plugin.name} as ${x} is not activated`;
            } else {
                const a = plugins[x].activate();
                if (typeof a === 'string') return a;
            }
            dep.push(plugins[x]);
        }
        return dep;
    }

    function deactivateDependents(plugin) {
        for (let x in plugins) {
            if (plugins[x].dependencies.includes(plugin.id)) {
                plugins[x].deactivate();
            }
        }
    }

    if (data.allowReloading) {
        plugin.type = 'runtime';

        plugin.activate = (delay = false) => {
            if (plugin.activated) return;
            const dep = activateDependencies(plugin);
            if (typeof dep === 'string') {
                setPluginActivate(false);
                alert(dep);
                return dep;
            }
            setPluginActivate();
            if (dep == null) return;
            if (data.activate) data.activate(plugin, ...dep);
            if (epp.theme != null && !delay) plugin.display(plugin);
        };
        plugin.deactivate = () => {
            if (!plugin.activated) return;
            if (epp.theme != null) plugin.hide(plugin);
            deactivateDependents(plugin);
            setPluginActivate(false);
            if (data.deactivate) data.deactivate(plugin, ...plugin.dependencies.map((x) => plugins[x]));
        };
    } else if (activatedPlugins[plugin.id]) {
        const dependencies = plugin.dependencies;
        if (dependencies.length !== 0) {
            let isActivated = false;
            delayed.push(() => {
                if (isActivated) return;
                for (const x of dependencies) {
                    if (plugins[x] == null || !plugins[x].activated) return;
                }
                isActivated = true;
                injector(
                    plugin,
                    data.init,
                    dependencies.map((x) => plugins[x])
                );
            });
            delayed.forEach((x) => x());
        } else {
            injector(plugin, data.init);
            initializeTheme(true);
        }
    }
    delayed.forEach((x) => x());
}

function injector(plugin, f, extra = []) {
    if (plugin.activated) return;
    plugin.activated = true;
    activatedPlugins[plugin.id] = true;
    setStorage('activatedPlugins', activatedPlugins);

    plugin.locations = Object.create(null);
    plugin.matches = Object.create(null);

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
    function delayed(f) {
        return {
            type: 'delayed',
            data: () => escape(f()),
        };
    }
    function delayedRegex(f) {
        return {
            type: 'delayed',
            data: f,
        };
    }
    delayed.r = delayedRegex;
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
                        } else if (v.type === 'delayed') {
                            str += v.data();
                        } else throw new Error('Invalid Type.');
                        break;
                }
                str += escape(strings.raw[i + 1]);
            }
            str += ')';
            return replace(str, (_, ...args) => {
                for (let i = 0; i < args.length - 2; i++)
                    if (nameMatch[i] != null) plugin.matches[nameMatch[i]] = args[i];
                let res = args[0];
                for (let i = 1; i < args.length - 2; i++) {
                    if (entries[i] != null) res += entries[i](plugin.matches);
                    res += args[i];
                }
                return res;
            });
        });
    }
    const defineLocationString = (strings, ...values) => defineLocation(escape, strings, ...values);
    const defineLocationRegex = (strings, ...values) => defineLocation((x) => x, strings, ...values);
    defineLocationString.re = defineLocationRegex;
    f(plugin, ...extra, {
        defineLocation: defineLocationString,
        entry,
        matchStart,
        matchEnd,
        regex,
        delayed,
    });
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

{
    const rp = require.context('./plugins/', true, /\.js$/);
    rp.keys().forEach((x) => rp(x).default(epp));
}

if (window.eppPlugins != null && Array.isArray(window.eppPlugins)) {
    for (let x of window.eppPlugins) {
        if (typeof x === 'function') {
            try {
                x(epp);
            } catch (e) {
                console.log(e);
            }
        }
    }
}
