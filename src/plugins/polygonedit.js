export default (epp) =>
    epp.plugin({
        id: 'polygonedit',
        name: 'Edit Polygons',
        dependencies: ['mapfinder'],
        init(c, mf, { defineLocation: $, entry, matchStart: ms, matchEnd: me }) {
            import('./polygonedit.styl');

            const lines = /(?:\n[ ]{24}[^\n]*)*/;
            const arrAccess = /\w+\[\d+\]/;
            $`
                    } else if (${arrAccess}[${'type'}] == ${'po'}) {
                        ${arrAccess} = ${'Yes'};
                        if (${ms('pComplete')}${arrAccess}${me}) {
                            ${arrAccess} = ${'No'};
                        }
                        ${/\w+/}(${ms('root')}${arrAccess}${me}, ${'Convex'}, {${lines}(${ms(
                'polygon'
            )}${arrAccess}${me}[${'s'}]));${entry('#polygonInsert')}
                    }`;
            // } else if (Q0a[2]["type" /*v5y.c25(1005)*/ ] == "po" /*v5y.d25(3261)*/ ) {
            //     Q0a[87] = "Yes" /*v5y.d25(2331)*/ ;
            //     if (Q0a[86]) {
            //         Q0a[87] = "No" /*v5y.c25(3355)*/ ;
            //     }
            //     s1h(Q0a[3], "Convex" /*v5y.c25(2037)*/ , {

            c.locations['#polygonInsert'](
                (m) => `
${m.pComplete} = false;
epp.plugins.polygonedit.addVertexEditor(${m.polygon}, ${m.root}.firstChild);
`
            );

            c.addVertexEditor = (shape, root) => {
                const { $ } = epp;

                root.querySelectorAll('.vertex-display').forEach((x) => root.removeChild(x));

                function create(d, a, i) {
                    return $.td.mapeditor_rightbox_table_leftcell([
                        d,
                        $.input.mapeditor_field.mapeditor_field_spacing_bodge.fieldShadow(
                            {
                                type: 'text',
                                oninput() {
                                    const p = parseInt(this.value);
                                    if (!isNaN(p)) {
                                        a[i] = p;
                                        mf.redraw();
                                    }
                                },
                                value: a[i],
                            },
                            []
                        ),
                    ]);
                }

                function createAddButton(index) {
                    const location = [0, 0];
                    if (shape.v.length === 1) {
                        location[0] = shape.v[0][0];
                        location[1] = shape.v[0][1];
                    } else if (shape.v.length !== 0) {
                        const i2 = (index + 1) % shape.v.length;
                        location[0] = (shape.v[index][0] + shape.v[i2][0]) / 2;
                        location[1] = (shape.v[index][1] + shape.v[i2][1]) / 2;
                    }
                    return $.td['vertex-add'](
                        {
                            onclick() {
                                shape.v.splice(index + 1, 0, location);
                                mf.redraw();
                                c.addVertexEditor(shape, root);
                            },
                            title: 'Insert New Vertex',
                        },
                        []
                    );
                }

                let displayed = false;

                let vertex = root.querySelector('.vertex');

                if (vertex == null) {
                    vertex = $.tr.vertex([
                        $.td.mapeditor_rightbox_table_leftcell(['Vertices']),
                        $.td.mapeditor_rightbox_table_leftcell(
                            $.div.mapeditor_rightbox_table_shape_pm['vertex-button'](
                                {
                                    onclick() {
                                        displayed = !displayed;
                                        if (displayed) {
                                            this.innerText = '-';
                                        } else {
                                            this.innerText = '+';
                                        }
                                        vertex.classList.toggle('vertex-displayed');
                                    },
                                },
                                ['+']
                            )
                        ),
                    ]);
                    root.append(vertex);
                }

                function generateVertex(index) {
                    const x = create('X: ', shape.v[index], 0);
                    x.style.paddingLeft = '5px';
                    const y = create('Y: ', shape.v[index], 1);
                    y.style.position = 'relative';
                    y.style.left = '-20px';
                    const z = $.td.brownButton.buttonShadow['vertex-close'](
                        {
                            onclick() {
                                shape.v.splice(index, 1);
                                mf.redraw();
                                c.addVertexEditor(shape, root);
                            },
                            title: 'Delete Vertex',
                        },
                        []
                    );
                    const arr = [x, y, z];
                    if (index > 0) arr.push(createAddButton(index - 1));
                    return $.tr['vertex-display'](arr);
                }
                vertex.after(
                    ...shape.v.map((_, i) => generateVertex(i)),
                    $.tr['vertex-display']({ style: 'height: 20px;' }, [
                        $.td.mapeditor_rightbox_table_leftcell([]),
                        $.td.mapeditor_rightbox_table_leftcell([]),
                        createAddButton(shape.v.length - 1),
                    ])
                );
            };
        },
    });
