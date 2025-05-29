import { createRouter, createWebHistory } from 'vue-router';
import { verifyTokenMiddleware } from './auth/middlewares/verifyTokenMiddleware.js';

import UsersView from '@/users/components/pages/VistasUsuarios/UsersView.vue';
import InventarioView from './users/components/pages/VistasInventarios/InventarioView.vue';
import RecursosView from '@/users/components/pages/VistasRecursos/RecursosView.vue'
import AlmacenesView from '@/users/components/pages/VistasAlmacenes/AlmacenesView.vue'
import SolucionesStockView from '@/users/components/pages/VIstasSolucionesStock/SolucionesStockView.vue'

import CreateUsersView from '@/users/components/pages/VistasUsuarios/CreateUsersView.vue';
import RecursosCrear from '@/users/components/pages/VistasRecursos/RecursosCrear.vue';
import CreateAlmacenesView from './users/components/pages/VistasAlmacenes/CreateAlmacenesView.vue';
import CreateSolucionS from '@/users/components/pages/VIstasSolucionesStock/CreateSolucionS.vue';

import EditUsersView from '@/users/components/pages/VistasUsuarios/EditUsersView.vue';
import EditRecursosView from '@/users/components/pages/VistasRecursos/EditRecursosView.vue'
import EditAlmacenesView from './users/components/pages/VistasAlmacenes/EditAlmacenesView.vue';
import EditSolucionesViewVue from './users/components/pages/VIstasSolucionesStock/EditSolucionesView.vue';

import DashboardView from '@/users/components/pages/DashboardView.vue';
import LoginView from '@/auth/components/pages/LoginView.vue';
import UnAuthorizedPage from '@/auth/components/pages/UnAuthorizedPage.vue';
import NoPermisos from '@/auth/components/pages/NoPermisos.vue'
import AuthLayout from '@/auth/components/layouts/AuthLayout.vue';



const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      
      path: '/',
      component: AuthLayout,
      
      children: [
        
        {
          
          path: '/usuarios',
          name: 'usuarios',
          component: UsersView,
          meta: { requireAuth: true}
        },
        {
          path: '/usuarios/crear',
          name: 'usuarios.create',
          component: CreateUsersView,
          meta: { requireAuth: true, requireAdmin: true }
        },
        {
          path: '/usuarios/:id/editar',
          name: 'usuarios.edit',
          component: EditUsersView,
          meta: { requireAuth: true, requireAdmin: true }
        },
        {
          path: '/usuarios/:id/eliminar',
          name: 'usuarios.delete',
          // Debes crear o importar el componente DeleteUsersView si existe
          // component: DeleteUsersView,
          meta: { requireAuth: true, requireAdmin: true }
        },
        {
          path: '/recursos',
          name: 'recursos',
          component: RecursosView,
          meta: { requireAuth: true}
        },
        {
          path: '/recursos/crear',
          name: 'recursos.create',
          component: RecursosCrear,
          meta: { requireAuth: true, requireAdmin: true}
        },
        {
          path: '/recursos/:id/editar',
          name: 'recursos.edit',
          component: EditRecursosView,
          meta: { requireAuth: true}
        },
        {
          path: '/almacenes',
          name: 'almacenes',
          component: AlmacenesView,
          meta: { requireAuth: true}
        },
        {
          path: '/almacenes/crear',
          name: 'almacenes.create',
          component: CreateAlmacenesView,
          meta: { requireAuth: true, requireAdmin: true}
        },
        {
          path: '/almacenes/:id/editar',
          name: 'almacenes.edit',
          component: EditAlmacenesView,
          meta: { requireAuth: true, requireAdmin: true}
        },
        {
          path: '/inventario',
          name: 'inventario',
          component: InventarioView,
          meta: { requireAuth: true}
        },
        {
          path: '/solucioness',
          name: 'solucioness',
          component: SolucionesStockView,
          meta: { requireAuth: true}
        },
        {
          path: '/solucioness/crear',
          name: 'solucioness.create',
          component: CreateSolucionS,
          meta: { requireAuth: true , requireAdmin: true}
        },
        {
          path: '/soluciones/:id/editar',
          name: 'soluciones.edit',
          component: EditSolucionesViewVue,
          meta: { requireAuth: true }
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashboardView,
          meta: { requireAuth: true }
        },
      ]
    },
    
    {
      path: '/403',
      name: '403',
      component: UnAuthorizedPage
    },
    {
      path: '/NoPermisos',
      name: 'NoPermisos',
      component: NoPermisos
    }
  ],
});

router.beforeEach(verifyTokenMiddleware);

// No agregues lógica de permisos aquí, el control de admin ya está en el middleware y en los componentes Vue.

export { router };