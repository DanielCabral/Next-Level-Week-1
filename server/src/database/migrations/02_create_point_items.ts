import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('point_items',table => {
        table.increments('id').primary();
        table.string('image')
            .notNullable()
            .references('id')
            .inTable('points');
        table.string('image').notNullable();
        table.string('title').notNullable();
        table.string('title').notNullable();
    });
}

export async function down(knex : Knex){
    return knex.schema.dropSchema('point_items');
}