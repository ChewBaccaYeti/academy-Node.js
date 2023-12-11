const uuid = require('uuid');
const fs = require('fs').promises;

/**
 * Create user
 */
exports.createUser = async (req, res) => {
    try {
        const { name, year } = req.body;

        const userDB = await fs.readFile('./models.json');
        const users = JSON.parse(userDB);

        const newUser = {
            name,
            year,
            id: uuid(),
        };

        users.push(newUser);

        await fs.writeFile('./models.json', JSON.stringify(users));

        res.status(201).json({
            user: newUser,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong...',
        });
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
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong...',
        });
    }
};

/**
 * Get user by id
 */
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong...',
        });
    }
};

/**
 * Update user by id
 */
exports.updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong...',
        });
    }
};

/**
 * Delete user by id
 */
exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong...',
        });
    }
};
