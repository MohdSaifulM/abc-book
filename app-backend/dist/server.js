"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const PORT = 5000;
const uri = 'mongodb://localhost:27017/abc';
//?===========Connect=============
mongoose_1.default.connect(uri)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Connected to DB & listening on port ${PORT}`);
    });
})
    .catch((error) => {
    console.log(`Failed to connect to server :: ${error}`);
});
