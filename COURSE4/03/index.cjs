const express = require('express');
const cors = require('cors');
const uuid = require('uuid');
const fs = require('fs').promises;
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const userRoute = require('./routes/userRoute');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cors());
app.use(express.json());

app.use('/users', userRoute);

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

// CRUD = create read update delete
// GET POST PUT PATCH DELETE / OPTIONS

/**
 * REST API
 * POST........./users........-create user
 * GET........../users........-get all users
 * GET........../users/:id....-get user by id
 * PUT/PATCH..../users/:id....-update user
 * DELETE......./users/:id....-delete user
 */

//CONTROLLERS
/**
 * Create user
 */
