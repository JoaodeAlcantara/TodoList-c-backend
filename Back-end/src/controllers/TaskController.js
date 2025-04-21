import TaskRepository from "../repositories/TaskRepository.js";

const TaskController = {
    create: async (req, res) => {
        const { title, description, status, dt_limit, user } = req.body;

        if (!title) return res.status(400).json({ message: 'O campo titulo é obrigatório' });
        if (!description) return res.status(400).json({ message: 'O campo descrição é obrigatório' });
        if (!dt_limit) return res.status(400).json({ message: 'O campo data é obrigatório' });

        const taskExist = await TaskRepository.getByTitle(title);

        if (taskExist) return res.status(400).json({
            status: 400,
            ok: false,
            message: 'Uma tarefa com esse titulo já existe'
        })

        try {
            const newTask = await TaskRepository.create({ title, description, status, dt_limit, user_id: parseInt(user) })

            if (newTask) return res.status(201).json({
                status: 201,
                ok: true,
                message: 'Tarefa criada com sucesso',
                newTask: newTask
            });

            return res.status(400).json({
                status: 400,
                ok: false,
                message: 'Erro ao criar a tarefa'
            });

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                ok: false,
                message: 'Erro no servidor'
            });
        }
    },
    getAll: async (req, res) => {
        const allTasks = await TaskRepository.getAll();

        if (allTasks) return res.status(200).json(allTasks);

        return res.status(404).json({
            status: 404,
            ok: false,
            message: 'Tarefas não encontradas'
        });
    },
    getById: async (req, res) => {
        const id = req.params.id;
        const task = await TaskRepository.getById(id);

        if (task) return res.status(200).json(task);

        return res.status(404).json({
            status: 404,
            ok: false,
            message: 'Tarefa não encontrada'
        });
    },
    getByTitle: async (req, res) => {
        const title = req.params.title
        const task = await TaskRepository.getByTitle(title);

        if (task) return res.status(200).json(task);

        return res.status(404).json({
            status: 404,
            ok: false,
            message: 'Tarefa não encontrada'
        });
    },
    getTaskByUserId: async (req, res) => {
        const id = parseInt(req.params.id);

        const tasks = await TaskRepository.getByUserId(id);

        if (tasks) return res.status(200).json(tasks);

        return res.status(404).json({
            status: 404,
            ok: false,
            message: 'Tarefa não encontrada'
        });
    },
    getFilterTask: async (req, res) => {
        const { status, title, order } = req.query;
        const id = parseInt(req.params.id);
        const tasks = await TaskRepository.getFilter(id, status, title, order);

        if (tasks) return res.status(200).json(tasks);

        return res.status(200).json([]);
    },
    update: async (req, res) => {
        try {
            const id = req.params.id;
            const body = req.body
            const task = await TaskRepository.update(id, { ...body });

            if (task) return res.status(200).json(task);

            return res.status(404).json({
                status: 404,
                ok: false,
                message: 'Tarefa não encontrada'
            });

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                ok: false,
                message: 'erro no servidor'
            });
        }
    },
    updateStatusByDt: async (req, res, next) => {
        try {
            const tasks = await TaskRepository.getAll();
            
            if (tasks && tasks.length > 0) {
                const today = new Date();
                
                tasks.forEach(async (task) => {
                    try {
                        if (new Date(task.dt_limit + "T23:59:59") < today && task.status === 'progresso') {
                            await TaskRepository.update(task.id, { status: 'pendente' });
                        } 
                    } catch (err) {
                        console.error(`Erro ao atualizar tarefa ${task.id}:`, err);
                    }
                });
            }
            
            next();
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                ok: false,
                message: 'erro no servidor'
            });
        }
        
    },
    delete: async (req, res) => {
        const id = req.params.id;

        try {
            const task = await TaskRepository.getById(id);

            if (task) {
                await TaskRepository.delete(id)
                return res.status(200).json(task);
            }

            return res.status(404).json({
                status: 404,
                ok: false,
                message: 'Falha ao exlcuir'
            });
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                status: 500,
                ok: false,
                message: 'erro no servidor'
            });
        }
    }
}

export default TaskController