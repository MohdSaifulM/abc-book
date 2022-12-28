import { Router } from "express";
import { getAllRequests, approveRequest } from "../controllers/requestController";

const requestRoutes: Router = Router();

//?===========Authenticated and Authorized Routes===========
requestRoutes.get('/all', getAllRequests);

requestRoutes.post('/approve/:id', approveRequest);

export default requestRoutes;