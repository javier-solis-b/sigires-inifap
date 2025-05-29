import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../../database.js";

const Almacen = sequelize.define('catalogos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_almacen: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {timestamps: false});

export { Almacen };
