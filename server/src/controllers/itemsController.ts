import {Request, Response} from 'express';

import knex from '../database/connection';

class ItemsControler{
    async index(request: Request,response: Response){
        const items= await knex('items').select('*');

        const sereliazedItems=items.map(item =>{
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.0.103:3333/upload/${item.image}`
            };
        });
        return response.json(sereliazedItems);
    }
}

export default ItemsControler;