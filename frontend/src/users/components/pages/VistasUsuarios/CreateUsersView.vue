<template>
  <v-form @submit.prevent="onSubmit">
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
    <div>
      <v-btn icon @click="$router.push('/usuarios')">
        <span > ⬅️ </span>
      </v-btn>
      <v-col class="encabezado" style="margin: -10px" cols="12">
        <h3 class="fw-bold mb-3">Crear un nuevo usuario</h3>
      </v-col>
    </div>
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12" sm="24" md="12">
            <v-text-field
              variant="underlined"
              v-model="name"
              label="Usuario"
              prepend-icon="mdi-account"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="24" md="12">
            <v-text-field
              v-model="password"
              type="password"
              label="Contraseña"
              variant="underlined"
               prepend-icon="mdi-lock" 
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="24" md="12">
            <v-text-field
              variant="underlined"
              v-model="repeatedPassword"
              type="password"
              label="Verificar contraseña"
              prepend-icon="mdi-lock"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="24" md="12">
            <!-- Checkbox para determinar si el usuario es administrador -->
            <v-checkbox
              v-model="isAdmin"
              :label="'¿Este usuario es un administrador?'"
              true-value=true
              false-value=false
            ></v-checkbox>
          </v-col>
          <v-col cols="12" sm="24" md="12">
            <v-btn type="submit" color="primary"> Crear usuario. </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-form>
</template>

<script>
import backend from "@/backend";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      name: "",
      password: "",
      repeatedPassword: "",
      isAdmin: null,
    };
  },
  methods: {
    async onSubmit() {
      // Validación de campos vacíos
      if (!this.name || !this.password || !this.repeatedPassword) {
        Swal.fire({
          icon: "warning",
          title: "Completa todos los campos",
          text: "Por favor, asegúrate de llenar todos los campos requeridos.",
          confirmButtonText: '<span style="color:white;">ok</span>',
        });
        return;
      }

      if (this.password !== this.repeatedPassword) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Las contraseñas no coinciden",
          confirmButtonText: '<span style="color:white;">ok</span>',
        });
        return;
      }

      // Convertir el valor del checkbox a un entero
      const isAdminInt = this.isAdmin === true ? 1 : 0;

      try {
        await backend.post("usuarios", {
          name: this.name,
          password: this.password,
          isAdmin: isAdminInt,
        });

        // Mostrar mensaje de éxito
        Swal.fire({
          icon: "success",
          title: "Usuario creado con éxito",
          text: "El nuevo usuario ha sido creado correctamente.",
          confirmButtonText: '<span style="color:white;">ok</span>',
        });

        // Redirigir al usuario después de mostrar el mensaje de éxito
        this.$router.push({ name: "usuarios" });
        console.log({
          name: this.name,
          password: this.password,
          repeatedPassword: this.repeatedPassword,
          isAdmin: isAdminInt,
        });
      } catch (error) {
        let errorMsg = "Hubo un problema al crear el usuario. Por favor, inténtalo de nuevo.";
        if (error.response && error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMsg = error.response.data;
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          } else if (error.response.data.error) {
            errorMsg = error.response.data.error;
          }
        }
        console.error("Error al crear el usuario:", error.response?.data || error);
        Swal.fire({
          icon: "error",
          title: "Error al crear el usuario",
          text: errorMsg,
          confirmButtonText: '<span style="color:white;">ok</span>',
        });
      }
    },
  },
};

</script>

<style lang="scss" scoped>
.encabezado {
  position: relative; /* Necesario para posicionar absolutamente el pseudo-elemento */
  padding: 10px;
  margin: -20px;
}

.linea {
  content: "";
  position: absolute;
  bottom: 0; /* Posiciona la línea en la parte inferior del encabezado */
  left: 50%; /* Centra horizontalmente la línea */
  width: 120%; /* Ajusta el ancho de la línea */
  height: 2px; /* Altura de la línea */
  background-color: var(
    --dark-alt
  ); /* Color de la línea, ajusta según sea necesario */
  transform: translateX(
    -50%
  ); /* Ajusta la posición de la línea para centrarla correctamente */
}
</style>