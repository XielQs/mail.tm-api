module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: 'standard-with-typescript',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    'no-async-promise-executor': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/method-signature-style': 'off'
  },
  ignorePatterns: [
    'test/**/*',
    'dist/**/*'
  ]
}
