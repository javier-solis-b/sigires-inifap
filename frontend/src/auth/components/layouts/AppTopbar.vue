<template>
  <div>
    <nav class="navbar mb-0" style="display: flex; align-items: center">
      <div style="flex: 1">
        <h5 class="text-nav" style="transform: translateX(10px) translateY(5px)">
          SIGIRES-INIFAP
        </h5>
      </div>
      <div class="username" style="margin-right: 20px; margin-left: 20px; transform: translateX(-30px)">
        <span>{{ username }}</span> <!-- Muestra el nombre del usuario -->
      
      </div>
      <div v-on:click="toggleMenu" class="nav-edit" style="background-image: url(/imagenes/admin.png); background-size: contain; cursor: pointer; border-radius: 50%; width: 30px; height: 30px; position: relative; transform: translateX(-30px) translateY(0px);">
        <ul v-if="isActive" style="list-style: none; background: white; position: absolute; top: 100%; z-index: 2; min-width: 300px; left: 100%; transform: translateX(-300px) translateY(8px); box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px; border-radius: 16px;">
          <li v-on:click="onLogout" style="padding: 10px 20px">Cerrar sesión</li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { TokenService } from "@/auth/Services/TokenService";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      isActive: false,
      isBarVisible: true,
      username: localStorage.getItem('username') || '', // Recupera el nombre del usuario
    };
  },
  methods: {
    handleMouseEnter(event) {
      const rect = this.$refs.iconContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= 10) {
        this.isMenuActive = true;
      }
    },
    handleMouseLeave() {
      this.isMenuActive = false;
    },
    toggleMenu() {
      this.isActive = !this.isActive;
    },
    toggleBarVisibility() {
      this.isBarVisible = !this.isBarVisible;
    },
    async onLogout() {
      const result = await Swal.fire({
        title: "¿Estás seguro de cerrar sesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: '<span style="color:white;">Sí, cerrar sesión</span>',
        cancelButtonText: '<span style="color:white;">No</span>',
      });

      if (result.isConfirmed) {
        TokenService.clear();
        localStorage.removeItem('username'); // Limpia el nombre del usuario
        this.$router.push({ name: "login" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-edit {
  &:hover {
    filter: brightness(130%);
  }
}
.username {
  align-items: center;
  display: flex;
  color: white !important;
  margin-left: auto; /* Añadido para separar el nombre de usuario */
  font-family: 'Roboto', sans-serif;
}
.navbar {
  background-color: #0c934a;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.text-nav {
  color: #ffd700 !important;
}
.navbar {
  background-color: #0c934a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky; /* Asegura que la barra permanezca en la parte superior */
  top: 0; /* Posicionamiento desde la parte superior */
  z-index: 9999; /* Valor alto para asegurar que se muestre por encima de otros elementos */
}
.nav-edit ul {
  list-style: none;
  background: white;
  position: absolute;
  top: 100%;
  z-index: 2000; /* Un valor menor que el de la navbar, pero mayor que otros elementos posiblemente superpuestos */
  min-width: 300px;
  left: 100%;
  transform: translateX(-300px) translateY(8px);
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 16px;
}
</style>
