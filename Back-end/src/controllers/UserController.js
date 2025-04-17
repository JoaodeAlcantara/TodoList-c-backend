import UserRepository from "../repositories/UserRepository.js";
import bycript from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET;

const UserController = {
    create: async (req, res) => {
        const { email, name, password } = req.body;

        if(!email) return res.status(400).json({message: 'O campo email é obrigatório'});
        if(!name) return res.status(400).json({message: 'O campo nome é obrigatório'});
        if(!password) return res.status(400).json({message: 'O campo senha é obrigatório'});

        const userExist = await UserRepository.getByEmail(email);

        if(userExist) return res.status(400).json({message: 'Esse email ja foi cadastrado'});

        try {
            const salt = await bycript.genSalt(10);
            const hashSenha = await bycript.hash(password, salt);
            const newUser = await UserRepository.create({
                email, name, password: hashSenha
            });

            if(newUser) return res.status(201).json(newUser);

            return res.status(400).json({message: 'Erro ao registrar usuario'});

        } catch (err){
            return res.status(500).json({message: 'Erro no servidor'});
        }
    },
    Login: async (req, res) => {
        const { email, password } = req.body;

        if(!email) return res.status(400).json({message: 'O campo email é obrigatório'});
        if(!password) return res.status(400).json({message: 'O campo senha é obrigatório'});

        try {
        const user = await UserRepository.getByEmail(email);

        if(!user) return res.status(404).json({
            status: 404,
            ok: false,
            message: 'Usuario não encontrado'
        });

        const checkPassword = await bycript.compare(password, user.password);

        if(!checkPassword) return res.status(400).json({ 
            status: 400,
            ok: false,
            message: 'Senha inválida' 
        });

        const token = jwt.sign(
        {
            id: user.id, 
            name: user.name, 
            email:user.email
        }, 
        SECRET, 
        {expiresIn: '14d'});

        res.status(200).json({
            status: 200,
            ok: true,
            token: token,
            id: user.id
        });

        } catch (err) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: 'error no servidor' 
            });
        }
    }
}

export default UserController