import { Table, Model, Column } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export default class user extends Model {
    @Column
    email: string;
    @Column(DataTypes.CHAR(60,true))
    password: string;
    @Column(DataTypes.CHAR(24))
    salt: string
}
