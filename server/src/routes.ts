import express from 'express';
import multer from 'multer';
import multerConfig from './config/multer'

const routes=express.Router();
const upload= multer(multerConfig);

import PointsController from './controllers/pointsController';
const pointsController=new PointsController();

import ItemsController from './controllers/itemsController';
const itemsController=new ItemsController();


routes.get('/items',itemsController.index);

routes.get('/points',pointsController.index);
routes.get('/points/:id',pointsController.show);

routes.post('/points', upload.single('image'), pointsController.create);



export default routes;
