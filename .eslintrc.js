module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:import/warnings'
    ],
    rules: {
        'no-constant-condition': ['error', { checkLoops: false }]
    },
    globals: {},
    parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: {
            modules: true
        }
    },
    env: {
        node: true,
        es6: true
    }
};
