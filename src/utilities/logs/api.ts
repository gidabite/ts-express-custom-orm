import {Request,} from 'express';
import logFactory from "./";

const logAPI = ({ path, method }: Request) => logFactory(path, method);

export default logAPI;