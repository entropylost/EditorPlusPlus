/**
 * USAGE: Load Editor++. Afterwards, paste this in the console. This works even if Editor++ crashes on load.
 */

/*globals requirejs*/
'use strict';

let alphaLocation = 'https://bonk2.io/beta/alpha-old.js';

let bundleName = JSON.parse(localStorage['epp.bundleName']);
let bundleAliases = [bundleName];
let bundleFunctionAliases = JSON.parse(localStorage['epp.bundleFunctionAliases']);
let preferredAlias = bundleFunctionAliases[0];

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:application/javascript;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

function deobfuscate(src, js_beautify) {
    const bundleAliasMatcher = new RegExp('var (\\w+)=' + bundleName + ';', 'g');
    const stringEncodingMatcher = /'(\\x\w\w)+'/g;

    const aliasMatches = [...src.matchAll(bundleAliasMatcher)];

    for (let x of aliasMatches) {
        bundleAliases.push(x[1]);
    }

    console.log(aliasMatches);
    console.log(bundleAliases);
    console.log(bundleFunctionAliases);

    const matcher = new RegExp(
        '(?:' + bundleAliases.join('|') + ')' + '\\.(?:' + bundleFunctionAliases.join('|') + ')' + '\\((\\d+)\\)',
        'g'
    );

    let source = src.replace(
        matcher,
        (match, number) =>
            `"${JSON.stringify(window[bundleName][preferredAlias](parseInt(number))).slice(1, -1)}"/*${match}*/`
    );

    source = source.replace(stringEncodingMatcher, (match) => `'${eval(match)}'`);

    download('alpha-deobfuscated.js', js_beautify(source));
}

let f = (url) => fetch(url).then((res) => res.text());

function startDeobfuscation() {
    requirejs(['https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.11.0/beautify.min.js'], (jsb) => {
        const js_beautify = jsb.js_beautify;
        f(alphaLocation).then((alpha) => deobfuscate(alpha, js_beautify));
    });
}

startDeobfuscation();
