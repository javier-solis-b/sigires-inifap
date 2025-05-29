<template>
    <v-form @submit.prevent="onSubmit">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <div>
        <v-btn icon @click="$router.push('/almacenes')">
          <span class="material-symbols-outlined"> arrow_back </span>
        </v-btn>
        <v-col class="encabezado" style="margin: -10px" cols="12">
          <h3 class="fw-bold mb-3">Crear un nuevo almacén</h3>
        </v-col>
      </div>
      <v-card>
        <v-container>
          <v-row>
            <v-col cols="12" sm="24" md="12">
              <v-text-field
                variant="underlined"
                v-model="nombre_almacen"
                label="Nombre del almacén"
                prepend-icon="mdi-warehouse"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="24" md="12">
              <v-btn type="submit" color="primary"> Crear almacén </v-btn>
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
      nombre_almacen: "",
    };
  },
  methods: {
    async onSubmit() {
      // Validación de campos vacíos
      if (!this.nombre_almacen) {
        Swal.fire({
          icon: "warning",
          title: "Necesitas asignar un nombre al almacén",
          text: "Por favor, asegúrate de llenar todos los campos requeridos.",
          confirmButtonText: '<span style="color:white;">ok</span>',
        });
        return;
      }

      try {
        await backend.post("almacenes", { nombre_almacen: this.nombre_almacen });

        // Mostrar mensaje de éxito
        Swal.fire({
          icon: "success",
          title: "Almacén creado con éxito",
          text: "El nuevo almacén ha sido creado correctamente.",
          confirmButtonText: '<span style="color:white;">ok</span>',
        });

        // Redirigir al usuario después de mostrar el mensaje de éxito
        this.$router.push({ name: "almacenes" });
        console.log({
          nombre_almacen: this.nombre_almacen,
        });
      } catch (error) {
        console.error("Error al crear el almacén:", error.response.data);
        Swal.fire({
          icon: "error",
          title: "Error al crear el almacen",
          text: "Hubo un problema al crear el almacén. Por favor, inténtalo de nuevo.",
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