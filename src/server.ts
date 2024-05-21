import express from 'express';
import { userRoutes } from './routes/user.routes';
import { config } from 'dotenv';

config();

const app = express();
const cors = require('cors');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
	next();
});

app.use(cors());
app.use(express.json());
app.use('/user', userRoutes);

app.listen(4000 , () => {
    console.log('Server is now running onw port 4000');
});