import { js as jsb } from 'js-beautify/';
import core from './core';
import config from './config.json';
import defaultTheme from './default.theme';

const { bundleName, bundleFunctionAliases, alphaLocation } = config;

const epp = {
    theme: {
        init: defaultTheme,
    },
};

let bundleAliases = [bundleName];

let injectionFinished = false;

function injectMain(src) {
    epp.theme.init(epp, epp.theme);
    import('./epp.svg').then((svg) => document.querySelectorAll('.icon').forEach((x) => (x.innerHTML = svg.default)));
    for (const x of injectors) x(epp, epp.theme);
    let source = src;

    function replace(str, func) {
        let numInstances = 0;
        source = source.replace(new RegExp(str, 'g'), (...args) => {
            numInstances++;
            return func(...args);
        });
        if (numInstances != 1) throw new Error('Invalid regex at:\n' + str);
    }

    const inverse = ((obj) => {
        var ne = {};

        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                ne[obj[prop]] = prop;
            }
        }

        return ne;
    })(Object.assign({}, config.pairings));

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

    const s = document.createElement('script');
    s.text = source;
    (document.head || document.documentElement).appendChild(s);
    injectionFinished = true;
}

const injectors = [];

const plugins = Object.create(null);

epp.plugins = plugins;

const matchers = [];
const delayed = [];

function escape(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function injector(name, f, dependencies = [], extra = []) {
    if (dependencies.length !== 0) {
        let isActivated = false;
        delayed.push(() => {
            if (isActivated) return;
            for (const x of dependencies) {
                if (plugins[x] == null) return;
            }
            isActivated = true;
            injector(
                name,
                f,
                [],
                dependencies.map((x) => plugins[x])
            );
        });
    }
    if (injectionFinished) throw new Error('Injection has already finished.');
    const plugin = {
        name: name,
        main: f,
        locations: Object.create(null),
    };
    plugins[name] = plugin;
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
    function add(escape, strings, ...values) {
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
    const addString = (strings, ...values) => add(escape, strings, ...values);
    const addRegex = (strings, ...values) => add((x) => x, strings, ...values);
    addString.re = addRegex;
    f(plugin, ...extra, addString, entry, matchStart, matchEnd, regex);
    delayed.forEach((x) => x());
    return (f) => {
        injectors.push(f);
    };
}

core(injector);

epp.injector = injector;

window.epp = epp;

function inject() {
    fetch(alphaLocation)
        .then((res) => res.text())
        .then((alpha) => injectMain(jsb(alpha)));
}

inject();
