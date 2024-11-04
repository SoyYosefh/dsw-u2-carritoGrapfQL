const User = require('../models/UserModel');

const getAllUsers = async () => {
    return User.find({});
}

const getUserById = async (id) => {
    return User.findById(id);
}

const createUser = async (user) => {
    return User.create(user);
}

const updateUser = async (_id, user) => {
    return User.findByIdAndUpdate(_id, user, { new: true });
}

const deleteUser = async (_id) => {
    return User.findByIdAndDelete(_id);
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}