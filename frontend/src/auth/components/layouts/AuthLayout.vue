<template>
  <div class="app">
    <AppTopbar />
    <div class="content">
      <AppSidebar class="sidebar" />
      <main class="main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
</script>

<style lang="scss">
/* Estilo para el contenedor principal de la aplicación */
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Estilo para el contenido principal que incluye el sidebar y el área de contenido */
.content {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

/* Estilo para el sidebar */
.sidebar {
  width: 250px; /* Ancho fijo para el sidebar */
  background-color: #333; /* Color de fondo para el sidebar */
  color: white; /* Color del texto para el sidebar */
  padding: 20px; /* Espaciado interno para el sidebar */
  flex-shrink: 0;
  overflow-y: auto; /* Permite el desplazamiento vertical si el contenido es más grande */
  
}

/* Estilo para el área de contenido principal */
.main {
  flex: 1;
  padding: 10px; /* Espaciado interno para el contenido principal */
  margin: 10px;
  background-color: var(--light); /* Color de fondo para el contenido principal */
  overflow-y: auto; /* Permite el desplazamiento vertical si el contenido es más grande */
  border-radius: 5px;
  
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 768px) {
  .sidebar {
    width: 200px; /* Reduce el ancho del sidebar en pantallas pequeñas */
  
  }
}

::-webkit-scrollbar{
  width: 8px;
}

::-webkit-scrollbar-thumb{
  background: var(--primary);
  border-radius: 10px;
  height: 90px;
}
</style>
