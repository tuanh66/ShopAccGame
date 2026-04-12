import { body } from "express-validator";
import Accounts from "../models/Accounts.js";


export const accountsValidator = [
    body("username")
];
