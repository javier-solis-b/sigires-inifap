// C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\Backend\src\Users\Models\SolucionRecursos.js
import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../../database.js";

const SolucionRecursos = sequelize.define('SolucionesRecursos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    solucion_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recurso_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad_usada: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, { timestamps: false });

export { SolucionRecursos };