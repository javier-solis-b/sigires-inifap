<template>
  <aside :class="`${is_expanded ? 'is-expanded' : ''}`">
    <link
      href="https://fonts.googleapis.com/css?family=Material+Icons"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=bar_chart"
    />
    <div class="menu-toggle-wrap">
      <button class="menu-toggle" @click="ToggleMenu">
       <span class="material-icons">keyboard_double_arrow_right</span>
      </button>
    </div>
    <h3>Menú</h3>
    <div class="menu">
      <router-link class="button" to="/dashboard">
        <span class="material-icons">home</span>
        <span class="text">Inicio</span>
      </router-link>
      <router-link class="button" to="/recursos">
       <span class="material-icons">science</span>
        <span class="text">Recursos</span>
      </router-link>
      <router-link class="button" to="/almacenes">
        <span class="material-icons">warehouse</span>
        <span class="text">Almacenes</span>
      </router-link>
      <router-link class="button" to="/solucioness">
        <span class="material-icons">inventory_2</span>
        <span class="text">Soluciones stock</span>
      </router-link>
     <!-- <router-link class="button" to="/#">
     <span class="material-icons"> bar_chart</span>
        <span class="text">Reportes</span>
      </router-link>-->
      <router-link class="button" to="/inventario">
       <span class="material-icons">fact_check</span>
        <span class="text">Inventario</span>
      </router-link>
      <!-- Mostrar la opción de Usuarios solo si el usuario es administrador -->
      <router-link  class="button" to="/usuarios">
        <span class="material-icons">group</span>
        <span class="text">Usuarios</span>
      </router-link>
    </div>
    <!-- Elimina el aviso de derechos reservados del sidebar -->
  </aside>
</template>

<script setup>
import { ref } from "vue";

// Estado para controlar si la barra lateral está expandida o no
const is_expanded = ref(localStorage.getItem("is_expanded") === "true");

// Función para alternar el estado de la barra lateral
const ToggleMenu = () => {
  // Alternar el estado de expansión de la barra lateral
  is_expanded.value = !is_expanded.value;
  // Guardar el estado de expansión en localStorage
  localStorage.setItem("is_expanded", is_expanded.value);
};
</script>


<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;
  background-color: var(--dark);
  color: var(--light);
  width: calc(2rem + 32px); // Tamaño cuando no está expandido
  overflow: hidden;
  min-height: 100vh;
  padding: 1rem;
  transition: 0.2s ease-in-out;

  .flex {
    flex: 1 1 0%;
  }

  .menu-toggle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;

    .menu-toggle {
      transition: 0.2s ease-in-out;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-out;
      }

      &:hover {
        .material-icons {
          color: var(--primary);
          transform: translateX(0.5rem);
        }
      }
    }
  }

  h3,
  .button .text {
    opacity: 0; // Ocultar texto cuando no está expandido
    transition: opacity 0.3s ease-in-out;
  }

  h3 {
    color: var(--grey);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .menu {
    margin: 0 -1rem;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;
      transition: 0.2s ease-in-out;
      padding: 0.5rem 1rem;

      .material-icons {
        font-size: 2rem;
        color: var(--light);
        transition: 0.2s ease-in-out;
      }

      .text {
        color: var(--light);
        transition: 0.2s ease-in-out;
      }

      &:hover {
        background-color: var(--dark-alt);

        .material-icons,
        .text {
          color: var(--primary);
        }
      }

      &.router-link-exact-active {
        background-color: var(--dark-alt);
        border-right: 5px solid var(--primary);

        .material-icons,
        .text {
          color: var(--primary);
        }
      }
    }
  }

  .footer {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;

    p {
      font-size: 0.875rem;
      color: var(--grey);
    }
  }

  &.is-expanded {
    width: 200px; // Tamaño cuando está expandido

    .menu-toggle-wrap {
      top: -3rem;

      .menu-toggle {
        transform: rotate(-180deg);
      }
    }

    h3,
    .button .text {
      opacity: 1; // Mostrar texto cuando está expandido
    }

    .button {
      .material-icons {
        margin-right: 1rem;
      }
    }

    @media (max-width: 1024px) {
      position: absolute;
      z-index: 100;
      width: 200px;
    }
  }

  @media (max-width: 1024px) {
    .sidebar-footer {
      font-size: 0.78rem;
      margin-top: 1.2rem;
      margin-bottom: 1rem;
      padding: 8px 0 4px 0;
    }
  }

  @media (max-width: 600px) {
    .sidebar-footer {
      font-size: 0.7rem;
      margin-top: 0.7rem;
      margin-bottom: 0.7rem;
      padding: 6px 0 2px 0;
    }
  }
}
</style>