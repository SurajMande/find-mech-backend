const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('joinMechanics', () => {
            socket.join('mechanics');
        });

        socket.on('joinRoom', (requestId) => {
            socket.join(requestId);
        });

        socket.on('accept_job', ({ requestId, mechanicId }) => {
            io.to(requestId).emit('job_accepted', { mechanicId });
            io.to('mechanics').emit('job_closed', requestId);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
};

module.exports = {
    setupSocket,
};
