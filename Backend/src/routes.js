//C:\Users\javis\OneDrive\Documentos\inventory-reagents-inifap\Backend\src\routes.js
import express from 'express';

//PARA USUARIOS
import { indexUserController } from './Users/Controllers/indexUserController.js';
import { createUserController } from './Users/Controllers/createUserController.js';
import { showController } from './auth/Controllers/showController.js';
import { deleteController } from './auth/Controllers/deleteController.js';
import { updateController } from './auth/Controllers/updateController.js';

//PARA RECURSOS
import { indexRecursoController } from './Users/Controllers/indexRecursoController.js';
import { createRecursoController } from './Users/Controllers/CreateRecursoController.js';
import { showControllerRecurso } from './auth/Controllers/RecursosControllers/showControllerRecurso.js';
import { recursoDeleteController } from './auth/Controllers/RecursosControllers/recursoDeleteController.js';
import { recursoUpdateController } from './auth/Controllers/RecursosControllers/recursoUpdateController.js';
import { updateCapacidad } from './auth/Controllers/RecursosControllers/showControllerRecurso.js';
import { updateRecipientes } from './auth/Controllers/RecursosControllers/showControllerRecurso.js';
//PARA ALMACENES
import { indexAlmacenController } from './Users/Controllers/indexAlmacenController.js';
import { almacenDeleteController } from './auth/Controllers/AlmacenesController/almacenDeleteController.js';
import { createAlmacenController } from './Users/Controllers/CreateAlmacenController.js';
import { almacenUpdateController } from './auth/Controllers/AlmacenesController/almacenUpdateController.js';
//PARA SOLUCION STOCK
import { usarSolucionController } from './Users/Controllers/usarSolucionController.js';
import { updateSolucionController } from './auth/Controllers/solucionesController/updateSolucionController.js';
import { solucionDeleteController } from './auth/Controllers/solucionesController/solucionDeleteController.js';
import { createSolucionStockController } from './Users/Controllers/createSolucionStockController.js';
import { indexSolucionesController } from './Users/Controllers/indexSolucionesController.js';
import { indexSolucionRecursosController } from './Users/Controllers/indexSolucionRecursosController.js'
import { showSolucionRecursoController } from './auth/Controllers/solucionesController/showSolucionRecursoController.js';
//GENERALES
import { loginController } from './auth/Controllers/loginController.js';
import { verifyTokenController } from './auth/Controllers/verifyTokenController.js';
import { tokenMiddleware } from './auth/Middlewares/tokenMiddleware.js';
import { SolucionesStock } from './Users/Models/SolucionesStock.js';
import { showControllerSolucion } from './auth/Controllers/solucionesController/showControllerSolucion.js';


const router = express.Router();
router.put('/api/v1/soluciones/:id', updateSolucionController);
router.post('/api/v1/login', loginController);
// Definir la ruta para obtener una solución por su ID
router.get('/api/v1/soluciones/:id', showControllerSolucion);
//CREAR
router.post('/api/v1/usuarios', tokenMiddleware, createUserController);
router.post('/api/v1/recursos', createRecursoController);
router.post('/api/v1/almacenes', createAlmacenController);
router.post('/api/v1/recursos/:id/update-capacity', tokenMiddleware, updateCapacidad);
router.post('/api/v1/recursos/:id/update-recipientes', tokenMiddleware, updateRecipientes);
router.post('/api/v1/soluciones-stock', createSolucionStockController);
//BORRAR
router.delete('/api/v1/usuarios/:id', tokenMiddleware, deleteController);
router.delete('/api/v1/recursos/:id', recursoDeleteController);
router.delete('/api/v1/almacenes/:id', almacenDeleteController);
router.delete('/api/v1/soluciones/:id', solucionDeleteController);
//EDITAR
router.patch('/api/v1/usuarios/:id', tokenMiddleware, updateController);
router.patch('/api/v1/recursos/:id', tokenMiddleware, recursoUpdateController);
router.patch('/api/v1/almacenes/:id', tokenMiddleware, almacenUpdateController)
//CONSULTAR
router.get('/api/v1/usuarios/:id', tokenMiddleware, showController);
router.get('/api/v1/usuarios', tokenMiddleware, indexUserController);
router.get('/api/v1/recursos/:id', tokenMiddleware, showControllerRecurso);
router.get('/api/v1/recursos', indexRecursoController);
router.get('/api/v1/soluciones', indexSolucionesController);
router.get('/api/v1/soluciones-recursos', indexSolucionRecursosController);
router.get('/api/v1/soluciones-recursos/:id', showSolucionRecursoController);
//OTROS
router.get('/api/v1/token/verify', verifyTokenController);
router.get('/api/v1/almacenes', indexAlmacenController);
router.get('/api/v1/soluciones/:id/recursos', showSolucionRecursoController);
router.post('/api/v1/soluciones/:solucion_id/usar', usarSolucionController);
export { router };
