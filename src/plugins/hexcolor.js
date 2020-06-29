// A0c is hsb to hex
// w0c is the opposite
// b34 is the hsb color
// v0c is the canvas
// O0c is the context
// If you type in the hex box then do showColorPicker with the new color as the first argument and the same for the second and third arguments.
// e0c is the function which gets called when a color is picked.
// Q0c is the display function.

export default (epp) =>
    epp.plugin({
        id: 'hexcolor',
        dependencies: [],
        init(epp, c, { defineLocation: $, entry, matchStart: ms, matchEnd: me, regex: _, delayed }) {
            const word = _('\\w+');
            const wordsWithCommas = _('(?:\\w+, )*\\w+');
            const line = _('[^\\n]+');

            $`${entry('#insertHexColorPickerHere')}
            this[${'showColorPicker'}] = function(${wordsWithCommas}) {
                var ${wordsWithCommas};
                ${word}[${'style'}][${'backgroundColor'}] = ${word}[${'numToHex'}](${word});
                ${word} = ${ms('hexConverter')}${word}${me}(${ms('startHexValue')}${word}${me});
                ${ms('hue')}${word}${me} = ${word}[${'hue'}];
                ${ms('brightness')}${word}${me} = ${word}[${'brightness'}];
                ${ms('saturation')}${word}${me} = ${word}[${'saturation'}];
                ${word} = ${word};
                ${word} = ${word};
                ${word} = ${word};${entry('#setColorPickerValue')}
                ${ms('refresh')}${word}${me}();`;
            // this["showColorPicker" /*O7J.w63(2015)*/ ] = function(W34, I34, X34, g34) {
            //     var b34;
            //     u0c["style" /*O7J.t63(844)*/ ]["backgroundColor" /*O7J.w63(2722)*/ ] = G["numToHex" /*O7J.w63(3465)*/ ](W34);
            //     b34 = w0c(W34);
            //     f0c = b34["hue" /*O7J.w63(2357)*/ ];
            //     h0c = b34["brightness" /*O7J.w63(2974)*/ ];
            //     T0c = b34["saturation" /*O7J.w63(1619)*/ ];
            //     e0c = X34;
            //     U0c = g34;
            //     C0c = W34;
            //     Q0c();
            //     a0c(I34);
            //     q0c["style" /*O7J.w63(844)*/ ]["display" /*O7J.w63(1722)*/ ] = "block" /*O7J.t63(192)*/ ;
            // };
            c.locations['#insertHexColorPickerHere'](
                (m) => `
const view = {
    get hue() {
        return ${m.hue};
    },
    set hue(x) {
        ${m.hue} = x;
    },
    get brightness() {
        return ${m.brightness};
    },
    set brightness(x) {
        ${m.brightness} = x;
    },
    get saturation() {
        return ${m.saturation};
    },
    set saturation(x) {
        ${m.saturation} = x;
    },
    refresh() {
        ${m.refresh}();
    },
    convertToHSB(x) {
        return ${m.hexConverter}(x);
    }
};
epp.plugins.hexcolor.insertHexColorPicker(view);`
            );
            c.locations['#setColorPickerValue'](
                (m) => `epp.plugins.hexcolor.setColorPickerValue(view, ${m.startHexValue})`
            );
            $`
            function ${delayed(() => c.matches.refresh)}() {${entry('#refresh')}
                var ${wordsWithCommas};
${line}
${line}
${line}
${line}
${line}
${line}
                    ${word}[${'style'}][${'backgroundColor'}] = ${ms(
                'hsbConverter'
            )}${word}${me}(${word}, ${word}, ${word});`;
            // function Q0c() {
            //     var Y1c, g74, V74, S74;
            //     Y1c = true;
            //     g74 = 1309324817;
            //     V74 = -1327364818;
            //     S74 = 2;
            //     for (var I74 = 1; O7J.h0A(I74.toString(), I74.toString().length, 14763) !== g74; I74++) {
            //         N0c(f0c, T0c, h0c, Y1c);
            //         n0c["style" /*O7J.t63(844)*/ ]["backgroundColor" /*O7J.t63(2722)*/ ] = o0c(f0c, T0c, h0c);
            c.locations['#refresh'](
                (m) => `
let res = ${m.hsbConverter}(${m.hue}, ${m.saturation}, ${m.brightness})
    .slice(4, -1)
    .split(',')
    .map(x => parseInt(x).toString(16).padStart(2, '0'));
if (res.every(x => x[0] === x[1])) res = res.map(x => x[0]);
document.getElementById('hexColorPicker').value = '#' + res.join('');
`
            );

            function setInputFilter(textbox, inputFilter) {
                ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'].forEach(
                    function (event) {
                        textbox.addEventListener(event, function () {
                            if (inputFilter(this.value)) {
                                this.oldValue = this.value;
                                this.oldSelectionStart = this.selectionStart;
                                this.oldSelectionEnd = this.selectionEnd;
                            } else if (Object.prototype.hasOwnProperty.call(this, 'oldValue')) {
                                this.value = this.oldValue;
                                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                            } else {
                                this.value = '';
                            }
                        });
                    }
                );
            }
            function setNumber(x, a) {
                const hsb = x.convertToHSB(a);
                x.hue = hsb.hue;
                x.saturation = hsb.saturation;
                x.brightness = hsb.brightness;
                x.refresh();
            }
            const before = document.getElementById('mapeditor_colorpicker_cancelbutton');
            const input = epp.$.input('hexColorPicker', { type: 'text' }, []);
            before.parentElement.insertBefore(input, before);
            c.insertHexColorPicker = (x) => {
                console.log(x);
                input.oninput = () => {
                    if (/^#[0-9a-f]{6}$/i.test(input.value)) {
                        setNumber(x, parseInt(input.value.substr(1), 16));
                    } else if (/^#[0-9a-f]{3}$/i.test(input.value)) {
                        setNumber(x, parseInt(input.value.substr(1).replace(/./g, '$&$&'), 16));
                    }
                };
                setInputFilter(input, (value) => /^#[0-9a-f]*$/i.test(value));
            };
            c.setColorPickerValue = (x, start) => {
                input.value = '#' + start.toString(16);
            };
        },
    });