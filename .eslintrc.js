module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",

        "Hooks": "readonly",
        "game": "writable",
        "CONFIG": "readonly",
        "Actors": "readonly",
        "Items": "readonly",
        "ActorSheet": "readonly",
        "ItemSheet": "readonly",
        "Handlebars": "readonly",
        "Roll": "readonly",
        "ChatMessage": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
    }
};