<template>
  <v-card
    v-if="display"
    class="elevation-6 pt-4"
    cols="10"
    sm="19"
    md="4"
    lg="2"
  >
    <div class="d-flex" style="justify-content: center">
      <div :style="responsiveStyle"></div>
    </div>
    <v-card-title class="text-center" style="padding: 0">
      {{ user.name ?? "" }}
    </v-card-title>
    <v-card-subtitle class="text-center">
      {{ user.isAdmin == 1 ? "Administrador 🟢" : "No es administrador⚫" }}
    </v-card-subtitle>
    <v-card-actions>
      <v-row>
        <v-col cols="6">
          <button
            type="button"
            class="btn btn-danger"
            style="width: 100%"
            v-on:click="onDeleteUser"
            :disabled="!isAdmin"
          >
            Eliminar
          </button>
        </v-col>
        <v-col cols="6">
          <button
            class="btn btn-secondary"
            type="button"
            style="width: 100%"
            v-on:click="onEditUser"
            :disabled="!isAdmin"
          >
            Editar
          </button>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import backend from "@/backend";
import Swal from "sweetalert2";

export default {
  props: {
    user: Object,
  },
  data() {
    return {
      display: true,
    };
  },
  computed: {
    responsiveStyle() {
      return {
        width: "70px",
        height: "70px",
        background: "gray",
        borderRadius: "50%",
        backgroundImage: "url(/imagenes/admin.png)",
        backgroundSize: "contain",
      };
    },
    isAdmin() {
      return localStorage.getItem('isAdmin') === 'true';
    }
  },
  methods: {
    async onDeleteUser() {
      // Verifica si el usuario actual es admin
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      if (!isAdmin) {
        this.$router.push('/NoPermisos');
        return;
      }
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Quieres eliminar al usuario ${this.user.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: '<span style="color:white;">Sí, eliminar</span>',
        cancelButtonText: '<span style="color:white;">Cancelar</span>',
      });
      if (!result.isConfirmed) {
        return;
      }
      await backend.delete(`usuarios/${this.user.id}`);
      this.$router.push('/usuarios'); // Navega a la lista de usuarios
      this.display = false;

      Swal.fire({
        icon: 'success',
        title: '¡Usuario eliminado exitosamente!',
        confirmButtonText: 'OK',
      }).then(() => {
        this.$router.push('/usuarios'); // Navega a la lista de usuarios
      });
    },
    async onEditUser() {
      this.$router.push({
        name: "usuarios.edit",
        params: { id: this.user.id },
      });
    },
  },
};
</script>

<style scoped>
.btn-rojo {
  background-color: red;
  color: white;
}

.btn-azul {
  background-color: blue;
  color: white;
}
</style>