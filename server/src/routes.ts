import express from 'express';
import knex from './database/connection';


const routes=express.Router();


routes.get('/items',async(request,response) => {
    const items= await knex('items').select('*');

    const sereliazedItems=items.map(item =>{
        return {
            title: item.title,
            image_url: `http://localhost:3333/upload/${item.image}`
        };
    });
    return response.json(sereliazedItems);
});



export default routes;
