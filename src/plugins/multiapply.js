export default (epp) =>
    epp.plugin({
        id: 'multiapply',
        dependencies: ['select'],
        allowReloading: true,
        display(c) {},
        hide(c) {},
        activate(c) {
            const modes = [
                {
                    name: 'Add',
                    from(current, previous) {
                        return current - previous;
                    },
                    to(diff, previous) {
                        return diff + previous;
                    },
                },
                {
                    name: 'Multiply',
                    from(current, previous) {
                        return current / previous;
                    },
                    to(diff, previous) {
                        return diff * previous;
                    },
                },
                {
                    name: 'Override',
                    from(current) {
                        return current;
                    },
                    to(diff) {
                        return diff;
                    },
                },
            ];
            c.modes = modes;
        },
        deactivate(c) {
            c.modes = null;
        },
    });
