import jwt from 'jsonwebtoken'

const SECRET = process.env.SECRET

const auth = (req, res, next) => {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader.split(' ')[1];

    if(!token) return res.status(401).json({message: 'acesso negado'});

    try {
        const dados = jwt.verify(token, SECRET);
        req.user = dados;

        next()
    } catch (err) {
        res.status(401).json({message: "Token inválido"})
    }
}

export default auth