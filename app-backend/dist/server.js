"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticationCheck_1 = require("./middleware/authenticationCheck");
const authorizationCheck_1 = require("./middleware/authorizationCheck");
const mongoose_1 = __importDefault(require("mongoose"));
//?===========Import Routes=======
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const requestRoutes_1 = __importDefault(require("./routes/requestRoutes"));
const app = (0, express_1.default)();
const PORT = 5000; //! Should be placed in environment variables
const uri = 'mongodb://localhost:27017/abc'; //! Should be placed in environment variables
//?===========Middleware==========
app.use(express_1.default.json());
//?===========Routes==============
app.use('/api/user', userRoutes_1.default);
app.use('/api/book', authenticationCheck_1.authenticationCheck, bookRoutes_1.default);
app.use('/api/request', authenticationCheck_1.authenticationCheck, authorizationCheck_1.adminAuthorizationCheck, requestRoutes_1.default);
app.all('*', (req, res, next) => {
    res.send('404!');
});
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    res.status(status).send(err.message);
});
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
