const { Router } = require('express');
const express = require('express');

const {
    createUser,
    getUsersList,
    getUserById,
    updateUserById,
    deleteUserById,
} = require('../controllers/userControllers');
const { checkUserById } = require('../middlewares/userMiddlewares');

const router = Router();

// GET POST PUT PATCH DELETE / OPTIONS

/**
 * REST API
 * POST........./users........-create user
 * GET........../users........-get all users
 * GET........../users/:id....-get user by id
 * PUT/PATCH..../users/:id....-update user
 * DELETE......./users/:id....-delete user
 */

// router.post('/', createUser);
// router.get('/', getUsersList);
// router.get('/:id', checkUserById, getUserById);
// router.patch('/:id', checkUserById, updateUserById);
// router.delete('/:id', checkUserById, deleteUserById);

// Обработчики CRUD = create read update delete
router.route('/').post(createUser).get(getUsersList);
// Middleware для проверки пользователя по ID
router.use('/:id', checkUserById);

router
    .route('/:id')
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserById);

module.exports = router;
