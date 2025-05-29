// C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\Backend\src\Users\Models\relations.js
import { SolucionesStock } from "./SolucionesStock.js";
import { SolucionRecursos } from "./SolucionRecursos.js";
import { Recurso } from "./Recursos.js";

// Definir relaciones
SolucionesStock.hasMany(SolucionRecursos, { foreignKey: 'solucion_id' });
SolucionRecursos.belongsTo(SolucionesStock, { foreignKey: 'solucion_id' });

SolucionRecursos.belongsTo(Recurso, { foreignKey: 'recurso_id' });
Recurso.hasMany(SolucionRecursos, { foreignKey: 'recurso_id' });