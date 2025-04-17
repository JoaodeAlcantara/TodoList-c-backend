import { PrismaClient } from '@prisma/client'

const prisma  = new PrismaClient()


const UserRepository = {
    create: async (data) => {
        const user = await prisma.users.create({
            data: {...data}
        })
        return user
    },
    getAll: async () => {
        const allUsers = await prisma.users.findMany();
        return allUsers
    },
    getByEmail: async (email) => {
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })
        return user
    },
    getById: async (id) => {
        const user = await prisma.users.findUnique({
            where: {
                id: id
            }
        })
        return user
    },
}

export default UserRepository