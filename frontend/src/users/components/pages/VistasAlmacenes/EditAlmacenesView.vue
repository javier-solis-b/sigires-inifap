<template>
  <v-form @submit.prevent="onSubmit">
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
    <div>
      <v-btn icon @click="$router.go(-1)">
        <span class="material-symbols-outlined">arrow_back</span>
      </v-btn>
      <v-col class="encabezado" style="margin: -10px" cols="12">
        <h3 class="fw-bold mb-3">Editar almacén</h3>
      </v-col>
    </div>

    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="almacen.nombre_almacen"
              type="text"
              label="Nombre del almacén"
              variant="underlined"
              prepend-icon="mdi-account"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12">
            <v-btn type="button" color="primary" @click="onSubmit">Actualizar</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-form>
</template>

<script>
import backend from "@/backend.js";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      almacen: {
        nombre_almacen: "",
      },
    };
  },
  async mounted() {
    const almacenId = this.$route.params.id;
    console.log('ID del almacén:', almacenId);

    try {
      const almacenData = await backend.get(`almacenes/${almacenId}`);
      console.log('Datos del almacén:', almacenData.data);
      
      this.almacen = {
        ...almacenData.data,
        nombre_almacen: almacenData.nombre_almacen
      };
    } catch (error) {
      console.error("Error al cargar los datos del almacén:", error);
      // Mostrar mensaje de error al usuario
    }
  },
  methods: {
    async onSubmit() {
      try {
        
        const response = await backend.patch(
          `almacenes/${this.$route.params.id}`,
          {
            nombre_almacen: this.almacen.nombre_almacen
          }
        );
        console.log('Respuesta de actualización:', response);
        this.$router.push({ name: 'almacenes' });
        Swal.fire({
          icon: "success",
          title: "Almacén creado con éxito",
          text: "El nuevo almacén ha sido creado correctamente.",
          confirmButtonText: '<span style="color:white;">ok</span>',
        });
      } catch (error) {
        console.error("Error al actualizar el almacen:", error);
        // Mostrar mensaje de error al usuario
      }
    },
  },
};
</script>

<style scoped>
.material-symbols-outlined {
  cursor: pointer;
}
</style>
