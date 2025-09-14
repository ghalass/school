require('dotenv').config()
const prisma = require('../prismaClient')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

let tokenExpireInHours = 7; //hour
const tokenExpireIn = tokenExpireInHours * 60 * 60 * 1000; // tokenExpireIn * 60 * 60 * 1000 ==> hours

const generateToken = (loggedUser) => {
    return jwt.sign(loggedUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: `${tokenExpireIn}h` });
};

// LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // FIELDS VALIDATION 
        if (!email || !password) { return res.status(400).json({ error: "Veuillez remplir tout les champs!" }); }
        if (!validator.isEmail(email)) { return res.status(400).json({ error: "E-mail invalide!" }); }

        // FIND THE USER
        const user = await prisma.user.findFirst({ where: { email: email } });

        // CHECK IF USER EXIST
        if (!user) { return res.status(400).json({ error: "E-mail Or Password incorrect." }) }

        // CHECK PASSWORD
        const match = await bcrypt.compare(password, user.password)
        if (!match) { return res.status(400).json({ error: "E-mail Or Password incorrect." }) }

        // CHECK IF ACCOUNT IS ACTIVE
        if (!user?.active) return res.status(400).json({ error: "Votre compte est désactivé, veuillez contacter un admin." })

        // SELECT USER FIELDS TO SAVE IN TOKEN
        const loggedUser = {
            id: user?.id,
            first_name: user?.first_name,
            last_name: user?.last_name,
            email: user?.email,
            role: user?.role,
        }
        // GENERATE TOKEN
        const token = generateToken(loggedUser)
        // res.cookie('jwt', token, {
        //     httpOnly: true, //accessible only by web server
        //     secure: true, //https
        //     sameSite: 'None', //cross-site cookie
        //     maxAge: tokenExpireIn,
        // });

        // SEND USER AND TOKEN
        res.status(200).json({ ...loggedUser, token })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// SIGNUP USER
const signupUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body

    try {
        // validation 
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ error: "Veuillez remplir tout les champs!" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "E-mail invalide!" });
        }
        if (!validator.isLength(password, { min: 6 })) {
            return res.status(400).json({ error: "Password doit être au minimum de 6 caractères!" });
        }

        const exists = await prisma.user.findFirst({
            where: { email: email }
        });

        if (exists) {
            return res.status(400).json({ error: "E-mail déjà utilisé." })
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const user = await prisma.user.create({
            data: { first_name, last_name, email, password: hash }
        });

        // SELECT USER FIELDS TO SAVE IN TOKEN
        const createdUser = {
            id: user?.id,
            first_name: user?.first_name,
            last_name: user?.last_name,
            email: user?.email,
            role: user?.role,
        }
        // GENERATE TOKEN
        // const token = generateToken(createdUser)

        // SEND USER AND TOKEN
        res.status(200).json(createdUser)
    } catch (error) {
        console.log(error);

        res.status(400).json({ error: error.message });
    }
}

// LOGOUT USER
const logoutUser = async (req, res) => {
    try {
        const cookies = req.cookies;
        res.clearCookie('jwt')
        res.status(200).json(cookies)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// CREATE A SUPER ADMIN IF NOT EXIST
const createSuperAdmin = async (req, res, next) => {
    try {
        const first_name = 'ghalass'
        const last_name = 'med'
        const email = 'ghalass@gmail.com'
        const password = 'gh@l@ss@dmin'
        const role = 'SUPER_ADMIN'
        const active = true

        // CHECK IF USER EXIST IN DATABASE
        const exists = await prisma.user.findFirst({ where: { email: email } });
        // IF EXIST RETURN
        if (exists) return res.status(400).json("SUPER_ADMIN ALREADY CREATED")
        // IF NOT EXIST RETURN => CREATE HIM
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const user = await prisma.user.create({
            data: { first_name, last_name, email, password: hash, role, active }
        });

        // CONFIRMATION
        return res.status(200).json("SUPER_ADMIN CREATED SUCCESSFULLY")
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}
// get all users
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: [
                { role: 'asc' },
                { first_name: 'asc' },
                { active: 'desc' },
            ],
            omit: { password: true }
        });
        return res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        console.log(`ID ===> ${id}`);

        const user = await prisma.user.findFirst({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({ error: "Enregistrement n'existe pas!" })
        }

        await prisma.user.delete({
            where: { id }
        });

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// update a user
const updateUser = async (req, res) => {
    try {
        const { id } = req.body

        // CHECK IF USER ID IS PROVIDED
        if (!req?.body?.id) return res.status(404).json({ error: "YOU MUST PROVID THE USER ID" })

        // FIND & CHECK IF USER TO UPDATE IS EXIST  
        const selectedUSER = await prisma.user.findFirst({ where: { id: id } });
        if (!selectedUSER) return res.status(404).json({ error: "USER NOT FOUND" })

        // CHECK IF EMAIL IS NOT ALREADY USED BY AN OTHER USER
        if (req?.body?.email && await prisma.user.findFirst({ where: { email: req?.body?.email, id: { not: id } } }))
            return res.status(401).json({ error: "CET EMAIL D'UTILISATEUR EST DÉJÀ UTILISÉ!" })

        delete req.body?.id; // remove id from req.body

        if (req.body.password !== "") {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt)
            req.body.password = hash
        } else {
            delete req.body.password
        }

        // UPDATE THE USER
        const updatedUser = await prisma.user.update({ where: { id: id }, data: req.body });

        // REMOVE PASSWORD BEFORE SEND USER
        const { password, ...updatedUserWithOutPassword } = updatedUser;

        res.status(200).json(updatedUserWithOutPassword)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    loginUser,
    signupUser,
    logoutUser,
    createSuperAdmin,
    getUsers,
    deleteUser,
    updateUser
}