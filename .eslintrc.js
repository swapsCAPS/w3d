module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2016,
    "sourceType": "module"
  },
  "rules": {
    "comma-dangle": ["error", "always-multiline"],
		"key-spacing": ["warn", { "mode": "minimum", "align": "value" }],
		"no-multi-spaces": 0,
		"arrow-body-style": ["error", "always"],
		"semi": ["warn", "never"],
		"max-len": [
			"off",
			{
				"code": 120
			}
		],

    "indent": [
      "warn",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-console": 0,
    "no-unused-vars": "warn"


  }
};
