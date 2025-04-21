import { Router } from "express";
import TaskController from "./controllers/TaskController.js";
import UserController from "./controllers/UserController.js";
import auth from "./middlewares/Auth.js";

const routes = Router();

routes.get('/', (req,res) => {
    res.status(200).json({message: 'Raiz do sistema acessada'})
})

// Login
routes.post('/cadastrar', UserController.create);
routes.post('/login', UserController.Login);

// GET
routes.get('/tasks', auth ,TaskController.getAll);
routes.get('/tasks/user/:id', auth, TaskController.updateStatusByDt, TaskController.getTaskByUserId);
routes.get('/tasks/id/:id', TaskController.getById);
routes.get('/tasks/title/:title', TaskController.getByTitle);
routes.get('/tasks/user/:id/filter',auth, TaskController.updateStatusByDt, TaskController.getFilterTask);

// Created
routes.post('/tasks',TaskController.updateStatusByDt, TaskController.create);

// Updated
routes.put('/tasks/:id', TaskController.update);

// Delete
routes.delete('/tasks/:id', TaskController.delete);

export default routes