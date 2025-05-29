<template>
  <v-form @submit.prevent="onSubmit">
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
    <div>
      <v-btn icon @click="$router.back()">
        <span class="material-symbols-outlined">arrow_back</span>
      </v-btn>
      <v-col class="encabezado" style="margin: -10px" cols="12">
        <h3 class="fw-bold mb-3">Crear un nuevo recurso</h3>
      </v-col>
    </div>

    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="catalogo_id"
              :items="catalogos"
              item-title="text"
              item-value="value"
              label="Almacen"
              variant="underlined"
              prepend-icon="mdi-storefront"
              required
              @input="actualizarCatalogoId"
              @change="onChangeCatalogo"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="no_inventario"
              label="No. de inventario"
              prepend-icon="mdi-format-list-numbered"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="nombre"
              label="Nombre"
              prepend-icon="mdi-label"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="tipo_recurso"
              :items="['Reactivo', 'Solución', 'Solvente']"
              label="Tipo de recurso"
              variant="underlined"
              prepend-icon="mdi-sort"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="marca"
              label="Marca"
              prepend-icon="mdi-tag"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="formula"
              label="Fórmula"
              variant="underlined"
              rows="3"
              prepend-icon="mdi-molecule"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="pm"
              label="PM"
              prepend-icon="mdi-wrench"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="capacidad_r"
              label="Cantidad disponible."
              type="number"
              prepend-icon="mdi-barrel"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="unidad_medida"
              :items="unidadesMedida"
              label="Unidad de medida"
              variant="underlined"
              prepend-icon="mdi-ruler-square"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="recipientes_actuales"
              label="Recipientes actuales"
              type="number"
              prepend-icon="mdi-cup"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="lote"
              label="Lote"
              prepend-icon="mdi-barcode"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="fecha_caducidad"
              label="Fecha de caducidad"
              type="date"
              prepend-icon="mdi-calendar-range"
              required
            ></v-text-field>
          </v-col>
          
        </v-row>
        <v-row justify="start" align="center" class="mt-4">
          <v-col cols="auto">
            <v-btn type="submit" color="primary">Crear recurso.</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-form>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import backend from "@/backend";
import Swal from "sweetalert2";
import { AlmacenService } from "@/users/services/AlmacenService.js";

export default {
  data() {
    return {
      nombre: "",
      tipo_recurso: "",
      no_inventario: "",
      marca: "",
      pm: "",
      formula: "",
      capacidad_r: "",
      lote: "",
      recipientes_actuales: "",
      catalogos: [],
      nombre_almacen: "",
      catalogo_id: null,
      fecha_caducidad: null,
      unidad_medida: '',
      unidadesMedida: ['mililitros', 'microlitros', 'mililitros', 'kilogramos', 'gramos' ,'miligramos', 'microgramos'],
    };
  },
  async mounted() {
    await this.cargarCatalogos();
    console.log("catalogo_id antes de enviar:", this.catalogo_id);
  },
  methods: {
    async cargarCatalogos() {
      try {
        const catalogos = await AlmacenService.all();
        this.catalogos = catalogos.map((catalogo) => ({
          value: catalogo.catalogo_id,
          text: `${catalogo.id} - ${catalogo.nombre_almacen}`,
        }));
      } catch (error) {
        console.error("Error al cargar los almacenes:", error);
        Swal.fire({
          icon: "error",
          title: "Error al cargar almacenes",
          text: "Hubo un problema al cargar los almacenes. Por favor, inténtalo de nuevo.",
          confirmButtonText: '<span style="color:white;">OK</span>',
        });
      }
    },
    actualizarCatalogoId(event) {
      console.log("Valor seleccionado:", event.target.value);
      this.catalogo_id = event.target.value;
    },
    onChangeCatalogo(value) {
      console.log("Valor seleccionado:", value);
      this.catalogo_id = value; // Ya es el valor numérico
    },
    async onSubmit() {
      if (!this.nombre || !this.tipo_recurso || !this.no_inventario) {
        Swal.fire({
          icon: "warning",
          title: "Completa todos los campos",
          text: "Por favor, asegúrate de llenar todos los campos requeridos.",
          confirmButtonText: '<span style="color:white;">OK</span>',
        });
        return;
      }

      if (!this.catalogo_id) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Seleccione un almacen",
          confirmButtonText: '<span style="color:white;">OK</span>',
        });
        return;
      }
      
      try {
        const id = uuidv4(); // Genera un ID UUID
        const response = await backend.post("recursos", {
          id: id,
          nombre: this.nombre,
          tipo_recurso: this.tipo_recurso,
          no_inventario: this.no_inventario,
          marca: this.marca,
          pm: parseFloat(this.pm),
          formula: this.formula,
          capacidad_r: parseInt(this.capacidad_r),
          lote: this.lote,
          recipientes_actuales: parseInt(this.recipientes_actuales),
          catalogo_id: parseInt(this.catalogo_id),
          fecha_caducidad: this.fecha_caducidad ? new Date(this.fecha_caducidad).toISOString().split('T')[0] : null,
          unidad_medida: this.unidad_medida,
        });

        console.log(response.data);
        
        Swal.fire({
          icon: "success",
          title: "Recurso creado con éxito",
          text: "El recurso ha sido creado exitosamente.",
          confirmButtonText: '<span style="color:white;">OK</span>',
        });

        this.$router.push({ name: "recursos" });
      } catch (error) {
        console.error(
          "Error al crear el recurso:",
          error.response?.data || error.message
        );
        Swal.fire({
          icon: "error",
          title: "Error al crear el recurso",
          text: "Hubo un problema al crear el recurso. Por favor, inténtalo de nuevo.",
          confirmButtonText: '<span style="color:white;">OK</span>',
        });
      }
    },
  },
};

</script>