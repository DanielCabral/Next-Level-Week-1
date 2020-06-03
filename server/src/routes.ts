import express from 'express';


const routes=express.Router();

import PointsController from './controllers/pointsController';
const pointsController=new PointsController();

import ItemsController from './controllers/itemsController';
const itemsController=new ItemsController();


routes.get('/items',itemsController.index);

routes.post('/points',pointsController.create);
routes.get('/points',pointsController.index);
routes.get('/points/:id',pointsController.show);





export default routes;
