module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:import/warnings',
        'plugin:json/recommended',
    ],
    rules: {
        'no-constant-condition': ['error', { checkLoops: false }],
    },
    globals: {},
    parserOptions: {
        ecmaVersion: 2020,
        ecmaFeatures: {
            modules: true,
        },
    },
    env: {
        node: true,
        es6: true,
    },
};
