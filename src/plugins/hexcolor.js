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
            // this["showColorPicker" /*h22.Z45(2395)*/ ] = function(S1v, I1v, U1v, V1v) {
            //     var V5X = [arguments];
            //     J5X[6]["style" /*h22.e45(3175)*/ ]["backgroundColor" /*h22.e45(1382)*/ ] = E2Q[11]["numToHex" /*h22.e45(83)*/ ](V5X[0][0]);
            //     V5X[1] = n0o(V5X[0][0]);
            //     J5X[57] = V5X[1]["hue" /*h22.Z45(801)*/ ];
            //     J5X[69] = V5X[1]["brightness" /*h22.Z45(3508)*/ ];
            //     J5X[86] = V5X[1]["saturation" /*h22.e45(2476)*/ ];
            //     h22.u22();
            //     J5X[39] = V5X[0][2];
            //     J5X[12] = V5X[0][3];
            //     J5X[56] = V5X[0][0];
            //     b0o();

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
${line}
                ${arrAccess}[${'style'}][${'backgroundColor'}] = ${ms(
                'hsbConverter'
            )}${word}${me}(${arrAccess}, ${arrAccess}, ${arrAccess});`;

            // function b0o() {
            //     var m5X = [arguments];
            //     h22.u22();
            //     m5X[1] = true;
            //     R0o(J5X[57], J5X[86], J5X[69], m5X[1]);
            //     J5X[8]["style" /*h22.e45(3175)*/ ]["backgroundColor" /*h22.Z45(1382)*/ ] = c0o(J5X[57], J5X[86], J5X[69]);

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
