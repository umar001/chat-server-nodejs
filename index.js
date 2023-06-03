const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const allowedOrigins = ['http://localhost:3001'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

app.use(cors(corsOptions));
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server);

const clients = [];

io.on('connection', (socket) => {
    clients.push(socket);

    socket.on('message', (message) => {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        const index = clients.indexOf(socket);
        if (index > -1) {
            clients.splice(index, 1);
        }
    });
});

app.get('/', (req, res) => {
    res.json({ websokets: true });
});

// Start the server
server.listen(3000, () => {
    console.log('Server started on port 3000');
});
