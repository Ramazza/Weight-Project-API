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
