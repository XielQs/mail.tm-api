module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true
    },
    extends: 'standard-with-typescript',
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        project: 'tsconfig.json'
    },
    rules: {
        indent: 'off',
        semi: 'off',
        'no-async-promise-executor': 'off',
        '@typescript-eslint/semi': 'off',
        '@typescript-eslint/no-misused-promises': 'off'
    }
};
