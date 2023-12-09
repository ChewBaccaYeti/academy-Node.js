const readline = require('readline');
const fs = require('fs').promises;
const { program } = require('commander');
require('colors');

// create readline instance and config it to interact with user via command line
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// readline usage example, write something in console after main command is executed
rl.on('line', (txt) => {
    console.log('||==========>>>>>');
    console.log(txt.blue.bgWhite);
    console.log('<<<<<==========||');

    process.exit();
});

// !<-- GAME LOGIC -->

// Commander configs
program.option(
    '-f, --file [type]',
    'file for saving results',
    'game_results.txt'
);
// use command line arguments
program.parse(process.argv);

/**
 * Simple input data validation
 * @param {number} val - value to validate
 * @return {boolean} - this is simple documentation for code below
 */
const isValid = (val) => {
    if (!Number.isNaN(val) && val > 0 && val <= 10) {
        return true;
    }
    if (Number.isNaN(val)) {
        console.log('Please, enter a number!'.red);
    }
    if (val < 1 || val > 10) {
        console.log('Please, enter a number between 1 and 10!'.red);
    }
    return false;
};

// path to log file
const logFile = program.opts().file;

/**
 * Log game results to the text file
 * @param {string} msg - message to log
 * @return {Promise<void>} - it means return promise with no data
 */
const logger = async (msg) => {
    try {
        await fs.appendFile(logFile, `${msg}\n`);
        console.log(`Game result: ${msg} to the file ${logFile}`.green);
    } catch (err) {
        console.log(`Something went wrong: ${err.message}`.red);
    }
};

// User attempts counter
let counter = 0;

// Guessed number, random number between 1 and 10
const mind = Math.ceil(Math.random() * 10);

/*
Main game process
*/
const game = () => {
    rl.question(
        'Please, enter any number between 1 and 10!\n. '.yellow,
        (answer) => {
            //? convert type from string to number
            // const number = Number(answer);
            // Same operation as above
            const number = +answer;
            // counter = counter + 1;
            // counter += 1;
            // ++counter;
            // Same operation as above
            counter++;
            // if number is not right
            if (number !== mind) {
                console.log('Wrong number!'.red);

                return game();
            }
            console.log(
                `Correct! You have guessed number in ${counter} step(s)`.green
            );

            logger(
                `${new Date().toLocaleString(
                    'uk-UK'
                )}: Congrats! You have guessed number in ${counter} step(s)`
            );

            rl.close();
        }
    );
};

game();
