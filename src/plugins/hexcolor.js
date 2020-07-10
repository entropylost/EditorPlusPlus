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
        name: 'Hex Color Picker',
        dependencies: [],
        init(c, { defineLocation: $, entry, matchStart: ms, matchEnd: me, delayed }) {
            const word = /\w+/;
            const wordsWithCommas = /(?:\w+, )*\w+/;
            const line = /[^\n]+/;
            const arrAccess = /\w+\[\d+\]/;
            const argsAccess = /\w+\[0\]\[\d+\]/;

            $`${entry('#insertHexColorPickerHere')}
            this[${'showColorPicker'}] = function(${wordsWithCommas}) {
                var ${word} = [arguments];
                ${arrAccess}[${'style'}][${'backgroundColor'}] = ${arrAccess}[${'numToHex'}](${ms(
                'startHexValue'
            )}${argsAccess}${me});
                ${arrAccess} = ${ms('hexConverter')}${word}${me}(${argsAccess});
                ${ms('hue')}${arrAccess}${me} = ${arrAccess}[${'hue'}];
                ${ms('brightness')}${arrAccess}${me} = ${arrAccess}[${'brightness'}];
                ${ms('saturation')}${arrAccess}${me} = ${arrAccess}[${'saturation'}];
${line}
${line}
${line}${entry('#setColorPickerValue')}
                ${ms('refresh')}${word}${me}();`;
            // this["showColorPicker" /*v5y.c25(981)*/ ] = function(j6a, G6a, F6a, S6a) {
            //     var j0B = [arguments];
            //     b0B[9]["style" /*v5y.d25(3184)*/ ]["backgroundColor" /*v5y.d25(2631)*/ ] = m9B[24]["numToHex" /*v5y.d25(73)*/ ](j0B[0][0]);
            //     j0B[8] = Y2Y(j0B[0][0]);
            //     b0B[55] = j0B[8]["hue" /*v5y.c25(2521)*/ ];
            //     b0B[80] = j0B[8]["brightness" /*v5y.d25(1916)*/ ];
            //     b0B[17] = j0B[8]["saturation" /*v5y.c25(2002)*/ ];
            //     b0B[26] = j0B[0][2];
            //     b0B[22] = j0B[0][3];
            //     b0B[52] = j0B[0][0];
            //     n9Y();
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
            c.locations['#setColorPickerValue']((m) => `epp.plugins.hexcolor.setColorPickerValue(${m.startHexValue})`);
            $`
            function ${delayed(() => c.matches.refresh)}() {${entry('#refresh')}
                var ${word} = [arguments];
${line}
${line}
                ${arrAccess}[${'style'}][${'backgroundColor'}] = ${ms(
                'hsbConverter'
            )}${word}${me}(${arrAccess}, ${arrAccess}, ${arrAccess});`;
            // function n9Y() {
            //     var u0B = [arguments];
            //     u0B[7] = true;
            //     X2Y(b0B[55], b0B[17], b0B[80], u0B[7]);
            //     b0B[4]["style" /*v5y.c25(3184)*/ ]["backgroundColor" /*v5y.c25(2631)*/ ] = j2Y(b0B[55], b0B[17], b0B[80]);
            c.locations['#refresh'](
                (m) => `
let res = ${m.hsbConverter}(${m.hue}, ${m.saturation}, ${m.brightness})
    .slice(4, -1)
    .split(',')
    .map(x => parseInt(x).toString(16).padStart(2, '0'));
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
                input.oninput = () => {
                    if (/^#[0-9a-f]{6}$/i.test(input.value)) {
                        setNumber(x, parseInt(input.value.substr(1), 16));
                    }
                };
                setInputFilter(input, (value) => /^#[0-9a-f]*$/i.test(value));
            };
            c.setColorPickerValue = (start) => {
                input.value = '#' + start.toString(16);
            };
        },
    });
