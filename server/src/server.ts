import express from 'express';

const app=express();

app.get('/users', (request,response) => {
    console.log('Listagem de usuarios');
    response.send('Listagem de usuarios');
});

app.listen(3333);