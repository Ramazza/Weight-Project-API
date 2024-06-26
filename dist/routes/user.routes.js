"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const UserRepository_1 = require("../modules/user_repository/UserRepository");
const login_1 = require("../middleware/login");
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
const userRepository = new UserRepository_1.UserRepository();
userRoutes.post('/sign-up', (request, response) => {
    userRepository.create(request, response);
});
userRoutes.post('/sign-in', (request, response) => {
    userRepository.login(request, response);
});
userRoutes.post('/add-data', login_1.login, (request, response) => {
    userRepository.addData(request, response);
});
userRoutes.post('/add-height', login_1.login, (request, response) => {
    userRepository.setHeight(request, response);
});
userRoutes.post('/add-goal', login_1.login, (request, response) => {
    userRepository.setGoal(request, response);
});
userRoutes.get('/get-user-data', login_1.login, (request, response) => {
    userRepository.getUserInfo(request, response);
});
userRoutes.get('/get-latest-weight', login_1.login, (request, response) => {
    userRepository.getLatestWeight(request, response);
});
userRoutes.get('/get-all-data', login_1.login, (request, response) => {
    userRepository.getAllUserData(request, response);
});
userRoutes.delete('/delete-weight', login_1.login, (request, response) => {
    userRepository.deleteUserData(request, response);
});
userRoutes.put('/update-weight', login_1.login, (request, response) => {
    userRepository.updateUserData(request, response);
});
