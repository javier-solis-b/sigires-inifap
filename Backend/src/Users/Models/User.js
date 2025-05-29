import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../../database.js";
 
//user model
const User = sequelize.define('users', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isAdmin: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    
    }, {timestamps: false});

export {User}