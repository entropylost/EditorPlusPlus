import './index.styl';
import { js as jsb } from 'js-beautify/';
import core from './core';
import config from './config.json';

const { bundleName, bundleFunctionAliases, alphaLocation } = config;

let bundleAliases = [bundleName];

let injectionFinished = false;

function injectMain(src) {
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

    const bundleAliasMatcher = new RegExp(
        'var (\\w+) = ' + bundleName + ';',
        'g'
    );

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

const plugins = Object.create(null);

const matchers = [];

function escape(string) {
    return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function injector(name, f) {
    if (injectionFinished) throw new Error('Injection has already finished.');
    const plugin = {
        name: name,
        main: f,
        locations: Object.create(null),
    };
    plugins[name] = plugin;
    function entry(name) {
        const computed = [];
        plugin.locations[name] = {
            add: (x) => {
                computed.push(x);
            },
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
    function add(strings, ...values) {
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
                        entries[i] = v;
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
                            if (!isWithinMatch)
                                throw new Error(
                                    'Can not use matchEnd without first using matchStart'
                                );
                            capIndex++;
                            str += ')(';
                            isWithinMatch = false;
                        } else throw new Error('Invalid Type.');
                        break;
                }
                str += escape(strings.raw[i]);
            }
            str += ')';
            return replace(str, (_, ...args) => {
                const matches = Object.create(null);
                for (let i = 0; i < args.length; i++)
                    if (nameMatch[i] != null) matches[nameMatch[i]] = args[i];
                let res = '';
                for (let i = 0; i < args.length; i++) {
                    res += args[i];
                    if (entries[i] != null) res += entries[i](matches);
                }
                return res;
            });
        });
    }
    f(add, entry, matchStart, matchEnd);
}

core(injector);

window.injector = injector;

function inject() {
    fetch(alphaLocation)
        .then((res) => res.text())
        .then((alpha) => injectMain(jsb(alpha)));
}

if (typeof disableInject === 'undefined')
    window.addEventListener('load', inject);
