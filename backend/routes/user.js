const express = require('express')

// controller functions
const { loginUser, signupUser, getByEmail, changePassword,
    getUsers, updateUser, refresh, deleteUser, logoutUser, checkToken,
    createSuperAdmin
} = require('../controllers/userController')

const requireAuth = require('../middleware/requireAuth')
const allowedRoles = require('../middleware/allowedRoles')

const router = express.Router()

// login route
router.post('/login', loginUser)

// logout route
router.post('/logout', logoutUser)

// CREATE A DEFAULT SUPER_ADMIN
router.get('/create_super_admin', createSuperAdmin)

// // refresh route
// router.post('/refresh', refresh)

// // checktoken route
// router.get('/checktoken', checkToken)

/*************************** REQUIRE AUTH FOR ALL ROUTES BELLOW ***************************/
router.use(requireAuth)

// CREATE A NEW USER ==> ONLY ADMIN & SUPER_ADMIN ARE ALLOWRD
router.post('/signup', allowedRoles(['SUPER_ADMIN', 'ADMIN']), signupUser)
// router.post('/signup', signupUser)

// GET ALL USERS
router.get('/users', getUsers)

// DELETE AN USER
// router.delete('/:id', deleteUser)
router.delete('/:id', allowedRoles(['SUPER_ADMIN', 'ADMIN']), deleteUser)

// // get user route
// router.post('/getByEmail', getByEmail)

// // get user route
// router.post('/changePassword', changePassword)

// UPDATE AN USER
router.patch('/updateUser', allowedRoles(['SUPER_ADMIN', 'ADMIN']), updateUser)



module.exports = router