console.log(__dirname);
console.log(__filename);

process.env.DEV = 'Development';

console.log(Buffer);
console.log(process.env); //environment variables
console.log(process.cwd()); //current working directory
console.log(process.argv); //command line arguments, node index.js arg1 arg2 ...

console.log(global); //global object

setTimeout(() => {
    console.log('||==========>>>>>');
    console.log('This is a message from setTimeout()!!!');
    console.log('<<<<<==========||');
}, 1500);

process.nextTick(function () {
    console.log('NextTick callback'.yellow);
}); // executes in the next iteration of the event loop

// process.chdir(); // change working directory

process.exit(); //exit the process
console.log('I will not see this message because of exit()');
