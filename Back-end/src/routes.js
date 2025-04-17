import { Router } from "express";
import TaskController from "./controllers/TaskController.js";
import UserController from "./controllers/UserController.js";
import auth from "./middlewares/Auth.js";

const routes = Router();

routes.get('/', (req,res) => {
    res.status(200).json({message: 'Raiz do sistema acessada'})
})

routes.post('/cadastrar', UserController.create);
routes.post('/login', UserController.Login);


routes.get('/tasks', auth ,TaskController.getAll);
routes.get('/tasks/user/:id', auth, TaskController.updateStatusByDt, TaskController.getTaskByUserId);
routes.get('/tasks/id/:id', TaskController.getById);
routes.get('/tasks/title/:title', TaskController.getByTitle);
routes.get('/tasks/user/:id/filter',auth, TaskController.getFilterTask);
routes.post('/tasks', TaskController.create);
routes.put('/tasks/:id', TaskController.update);
routes.delete('/tasks/:id', TaskController.delete);

export default routes