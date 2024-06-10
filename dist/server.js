"use strict";
/* import express from 'express';
import { userRoutes } from './routes/user.routes';
import { config } from 'dotenv';

const bodyParser = require('body-parser');

config();

const app = express();
const cors = require('cors');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
    next();
});

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);

app.listen(4000 , () => {
    console.log('Server is now running on port 4000');
}); */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("./routes/user.routes");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const bodyParser = require('body-parser');
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const cors = require('cors');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
    next();
});
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(express_1.default.json());
// Serve static files from the React app's build directory
app.use(express_1.default.static(path_1.default.join(__dirname, '../../weight-app/build')));
// API routes
app.use('/user', user_routes_1.userRoutes);
// Catch-all handler to serve the React app's index.html for any unknown routes
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../weight-app/build', 'index.html'));
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
});
