import express from "express";

import UserController from "../Controllers/UserController.js";

const UserRouter = express.Router()

UserRouter.get('/', UserController.getList)

UserRouter.post('/', UserController.add)

UserRouter.put('/:id', UserController.update)

UserRouter.delete('/:id', UserController.delete)

export default UserRouter