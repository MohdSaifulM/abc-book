"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requestController_1 = require("../controllers/requestController");
const requestRoutes = (0, express_1.Router)();
//?===========Authenticated and Authorized Routes===========
requestRoutes.get('/all', requestController_1.getAllRequests);
requestRoutes.post('/approve/:id', requestController_1.approveRequest);
exports.default = requestRoutes;
