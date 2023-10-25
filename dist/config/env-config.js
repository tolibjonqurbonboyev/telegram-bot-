"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env1 = exports.env = void 0;
const dotenv_1 = require("dotenv");
const envalid_1 = require("envalid");
(0, dotenv_1.config)();
exports.env = (0, envalid_1.cleanEnv)(process.env, {
    TOKEN: (0, envalid_1.str)()
});
exports.env1 = (0, envalid_1.cleanEnv)(process.env, {
    MY_WEATHER: (0, envalid_1.str)()
});
