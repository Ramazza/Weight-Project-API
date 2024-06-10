import { Router } from 'express';
import { UserRepository } from '../modules/user_repository/UserRepository';
import { login } from '../middleware/login';

const userRoutes = Router();
const userRepository = new UserRepository();

userRoutes.post('/sign-up', (request, response) => {
    userRepository.create(request, response);
});

userRoutes.post('/sign-in', (request, response) => {
userRepository.login(request, response);
});

userRoutes.post('/add-data', login, (request, response) => {
    userRepository.addData(request, response);
});

userRoutes.post('/add-height', login, (request, response) => {
    userRepository.setHeight(request, response);
});

userRoutes.post('/add-goal', login, (request, response) => {
    userRepository.setGoal(request, response);
});

userRoutes.get('/get-user-data', login, (request, response) => {
    userRepository.getUserInfo(request, response);
});

userRoutes.get('/get-latest-weight', login, (request, response) => {
    userRepository.getLatestWeight(request, response);
});

userRoutes.get('/get-all-data', login, (request, response) => {
    userRepository.getAllUserData(request, response);
});

userRoutes.delete('/delete-weight', login, (request, response) => {
    userRepository.deleteUserData(request, response);
});

userRoutes.put('/update-weight', login, (request, response) => {
    userRepository.updateUserData(request, response);
}); 

export { userRoutes };