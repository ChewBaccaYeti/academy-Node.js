const fs = require('fs').promises;
const express = require('express');

const app = express();

exports.checkUserById = async (req, res, next) => {
    app.use('/users/:id', async (req, res, next) => {
        try {
            const { id } = req.params;

            const users = JSON.parse(await fs.readFile('./models.json'));

            const user = users.find((user) => user.id === id);

            if (!user) {
                return res.status(404).json({
                    message: 'User does not exist...',
                });
            }

            req.user = user;

            next();
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Something went wrong...',
            });
        }
    });
};
