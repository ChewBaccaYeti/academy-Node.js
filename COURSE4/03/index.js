const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const userRoute = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cors());
app.use(express.json());

// ENDPOINTS=================
app.use('/users', userRoute);

// UNKNOWN REQUESTS HANDLER==============
app.all('*', (req, res) => {
    res.status(404).json({
        message: 'Resource not found...',
    });
});

// GLOBAL ERROR HANDLER===========
app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message,
    });
});

// SERVER ===========================================
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
