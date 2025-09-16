const bcrypt = require('bcrypt');
const prisma = require('../../prismaClient');
const validator = require('validator');
const jwt = require('jsonwebtoken')

module.exports = {
    users: async () => {
        try {
            const users = await prisma.user.findMany({
                include: { createdEvents: true }
            });
            return users.map(user => {
                return { ...user, password: null };
            });
        } catch (error) {
            throw new Error(error?.message || "Failed to fetch users");
        }
    },
    createUser: async (args) => {
        try {
            // validation 
            if (!args.userInput.first_name || !args.userInput.email || !args.userInput.password) {
                throw new Error('Veuillez remplir tout les champs!');
            }
            if (!validator.isEmail(args.userInput.email)) {
                throw new Error('E-mail invalide!');
            }
            if (!validator.isLength(args.userInput.password, { min: 6 })) {
                throw new Error('Password doit être au minimum de 6 caractères!');
            }
            const existingUser = await prisma.user.findFirst({
                where: { email: args.userInput.email }
            });
            if (existingUser) {
                throw new Error('Email déjà utilisé.');
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(args.userInput.password, salt)
            const data = {
                first_name: args.userInput.first_name,
                last_name: args.userInput.last_name,
                email: args.userInput.email,
                password: hashedPassword,
            };
            const createdUser = await prisma.user.create({
                data: data
            });
            return createdUser;

        } catch (error) {
            throw new Error(error?.message || "Failed to create user");
        }
    },
    login: async ({ email, password }) => {
        try {
            // FIELDS VALIDATION 
            if (!email || !password) { throw new Error("Veuillez remplir tout les champs!"); }
            if (!validator.isEmail(email)) { throw new Error("E-mail invalide!"); }

            // FIND THE USER
            const user = await prisma.user.findFirst({ where: { email: email } });

            // CHECK IF USER EXIST
            if (!user) { throw new Error("E-mail Or Password incorrect."); }

            // CHECK PASSWORD
            const match = await bcrypt.compare(password, user.password)
            if (!match) { throw new Error("E-mail Or Password incorrect."); }

            // CHECK IF ACCOUNT IS ACTIVE
            if (!user?.active) throw new Error("Votre compte est désactivé, veuillez contacter un admin.");

            // GENERATE TOKEN
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: `1h` });

            // SEND USER AND TOKEN
            return { userId: user.id, token, tokenExpiration: 1 }
        } catch (error) {
            throw new Error(error?.message || "Failed to login user");
        }
    }
}