export default (epp) =>
    epp.plugin({
        id: 'polygonedit',
        dependencies: ['mapfinder'],
        init(c, mf, { defineLocation: $, entry, matchStart: ms, matchEnd: me, regex: _ }) {
            const lines = _('(?:\\n                        [^\\n]*)*');
            const arrAccess = _('\\w+\\[\\d+\\]');
            $`
                    } else if (${arrAccess}[${'type'}] == ${'po'}) {
                        ${arrAccess} = ${'Yes'};
                        if (${ms('pComplete')}${arrAccess}${me}) {
                            ${arrAccess} = ${'No'};
                        }
                        ${_('\\w+')}(${ms('root')}${arrAccess}${me}, ${'Convex'}, {${lines}(${ms(
                'polygon'
            )}${arrAccess}${me}[${'s'}]));${entry('#polygonInsert')}
                    }`;
            c.locations['#polygonInsert'](
                (m) => `
${m.pComplete} = false;
epp.plugins.polygonedit.addVertexEditor(${m.polygon}, ${m.root});
`
            );

            c.addVertexEditor = (shape, root) => {
                const { $ } = epp;

                let displayed = false;

                const vertex = $.tr([
                    $.td.mapeditor_rightbox_table_leftcell(['Vertexies:']),
                    $.td.mapeditor_rightbox_table_leftcell(
                        $.div.mapeditor_rightbox_table_shape_pm(
                            {
                                style: {
                                    paddingTop: '5px',
                                    paddingBottom: '5px',
                                },
                                onclick() {
                                    displayed = !displayed;
                                    let display = 'revert';
                                    if (displayed) {
                                        this.innerText = '-';
                                    } else {
                                        this.innerText = '+';
                                        display = 'none';
                                    }
                                    root.firstChild
                                        .querySelectorAll('.vertex-display')
                                        .forEach((x) => (x.style.display = display));
                                },
                            },
                            ['+']
                        )
                    ),
                ]);

                function generateVertex(index) {
                    function create(d, i) {
                        return $.td.mapeditor_rightbox_table_leftcell([
                            d,
                            $.input.mapeditor_field.mapeditor_field_spacing_bodge.fieldShadow(
                                {
                                    type: 'text',
                                    oninput() {
                                        const p = parseInt(this.value);
                                        if (!isNaN(p)) {
                                            shape.v[index][i] = p;
                                        }
                                    },
                                    value: shape.v[index][i],
                                },
                                []
                            ),
                        ]);
                    }

                    return $.tr['vertex-display'](
                        {
                            style: {
                                display: 'none',
                                whiteSpace: 'nowrap',
                            },
                        },
                        [create('X:', 0), create('Y:', 1)]
                    );
                }

                root.firstChild.append(vertex);

                root.firstChild.append(...shape.v.map((_, i) => generateVertex(i)));
            };
        },
    });
