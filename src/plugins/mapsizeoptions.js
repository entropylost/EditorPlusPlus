export default (epp) =>
    epp.plugin({
        id: 'mapsizeoptions',
        dependencies: [],
        init(c, { defineLocation: $, entry, matchStart: ms, matchEnd: me, regex: _ }) {
            $`
                ${ms('array')}${_('\\w+\\[\\d+\\]')}${me}[${'push'}]({
                    value: 5,
                    text: ${'13 - Biggest'}
                });${entry('#endingMapEditor')}`;
            // E1a[3]["push" /*v5y.c25(125)*/ ]({
            //     value: 5,
            //     text: "13 - Biggest" /*v5y.c25(596)*/
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
