const updateCron = require('./UpdateCron');


const initIO = function (io) {
    io.on('connection', socket => {
        // console.info("IO connection establish",socket);
        console.log(`new connection ${socket.id}`);
        socket.on('whoami', (cb) => {
            cb(socket.request.user ? socket.request.user.username : '');
        });
        const session = socket.request.session;
        console.log(`saving sid ${socket.id} in session ${session.id}`);
        session.socketId = socket.id;
        session.save();
    });
};

module.exports = {
    init: initIO
};
