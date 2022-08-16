module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true
	},
	extends: 'standard-with-typescript',
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {
		'no-tabs': 'off',
		indent: 'off',
		semi: 'off'
	}
};
