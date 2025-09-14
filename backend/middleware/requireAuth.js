const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
    try {
        // VERIFIER AUTHENTIFICATION
        const { authorization } = req.headers

        if (!authorization) {
            return res.status(401).json({ error: 'AUTHORIZATION TOKEN REQUIRED' });
        }

        const token = authorization.split(' ')[1];

        // Vérifier la validité du token
        try {
            const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            // Vérifier si l'utilisateur existe dans la base de données
            req.user = await prisma.user.findUnique({
                where: { id: id },
                select: { id: true, first_name: true, last_name: true, email: true, role: true }
            });
            next();

        } catch (error) {
            return res.status(401).json({ error: 'REQUEST IS NOT AUTHORIZED' });
        }
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ error: 'INTERNAL SERVER ERROR!' });
    }
};

module.exports = requireAuth;
