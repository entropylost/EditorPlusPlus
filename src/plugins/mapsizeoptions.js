export default (epp) =>
    epp.plugin({
        id: 'mapsizeoptions',
        dependencies: [],
        init(c, { defineLocation: $, entry, matchStart: ms, matchEnd: me, regex: _ }) {
            $`
                ${ms('array')}${_('\\w+')}${me}[${'push'}]({
                    value: 5,
                    text: ${'13 - Biggest'}
                });${entry('#endingMapEditor')}`;
            // k8c["push" /*O7J.w63(236)*/ ]({
            //     value: 5,
            //     text: "13 - Biggest" /*O7J.w63(3348)*/
            // });
            c.locations['#endingMapEditor']((m) => `epp.plugins.mapsizeoptions.populateMapSizeArray(${m.array});`);

            c.populateMapSizeArray = (arr) => {
                arr.length = 0;
                [
                    100,
                    80,
                    60,
                    50,
                    40,
                    [30, '(Smallest)'],
                    25,
                    20,
                    17,
                    15,
                    13,
                    [12, '(Regular)'],
                    10,
                    9,
                    8,
                    7,
                    6,
                    [5, '(Biggest)'],
                    4,
                    3,
                    2,
                ].forEach((x) => {
                    let res = {
                        value: x,
                        text: `${x}`,
                    };
                    if (Array.isArray(x)) {
                        res = {
                            value: x[0],
                            text: `${x[0]} ${x[1]}`,
                        };
                    }
                    arr.push(res);
                });
            };
        },
    });
