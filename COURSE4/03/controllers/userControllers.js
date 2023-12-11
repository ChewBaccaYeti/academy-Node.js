const uuid = require('uuid');
const fs = require('fs').promises;

const AppError = require('../utils/appError');
const { createUserDataValidator } = require('../utils/userValidators');

/**
 * Create user
 */
exports.createUser = async (req, res, next) => {
    try {
        // const { name, year } = req.body;

        const { error, value } = createUserDataValidator(req.body);

        if (error) {
            throw new AppError(400, 'Bad user data...');
        }

        const userDB = await fs.readFile('./models.json');
        const users = JSON.parse(userDB);

        const newUser = {
            name: value.name,
            year: value.year,
            id: uuid(),
        };

        users.push(newUser);

        await fs.writeFile('./models.json', JSON.stringify(users));

        res.status(201).json({
            user: newUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'User not created...',
        });

        next(error);
    }
};

/**
 * Get user list
 */
exports.getUsersList = async (req, res) => {
    try {
        const userDB = await fs.readFile('./models.json');
        res.status(200).json({
            users: JSON.parse(userDB),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Can not get list...',
        });
    }
};

/**
 * Get user by id
 */
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Can not get user by id...',
        });
    }
};

/**
 * Update user by id
 */
exports.updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Can not update user by id...',
        });
    }
};

/**
 * Delete user by id
 */
exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Can not delete user by id...',
        });
    }
};
