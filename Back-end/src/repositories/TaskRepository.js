import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TaskRepository = {
    create: async (data) => {
        const task = await prisma.tasks.create({
            data: { ...data }
        })
        return task
    },
    getAll: async () => {
        const tasks = await prisma.tasks.findMany();
        return tasks
    },
    getById: async (id) => {
        const task = await prisma.tasks.findUnique({
            where: {
                id: id
            }
        })
        return task
    },
    getByTitle: async (title) => {
        const task = await prisma.tasks.findFirst({
            where: {
                title: title
            }
        })
        return task
    },
    getByUserId: async (id) => {
        const tasks = await prisma.tasks.findMany({
            where: {
                user_id: id,
            },
            orderBy: { createdAt: 'desc' }
        })
        return tasks
    },
    getFilter: async (id, status, title, order) => {
        const tasks = await prisma.tasks.findMany({
            where: {
                user_id: id,
                status: status || undefined,
                title: title ? { contains: title } : undefined
            },
            orderBy: order === 'asc' || order === 'desc' 
            ? { title: order } 
            : { createdAt: 'desc' }
        })
        return tasks
    },
    update: async (id, data) => {
        const task = await prisma.tasks.update({
            where: {
                id: id
            },
            data: { ...data }
        })
        return task
    },
    delete: async (id) => {
        const task = await prisma.tasks.delete({
            where: {
                id: id
            }
        })
        return task
    }
}

export default TaskRepository