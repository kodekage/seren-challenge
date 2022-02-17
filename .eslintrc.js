module.exports = {
  "env": {
    "node": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "indent": ["error", 2],
  }
};
