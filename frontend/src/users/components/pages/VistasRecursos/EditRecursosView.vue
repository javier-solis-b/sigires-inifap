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
        <h3 class="fw-bold mb-3">{{ formTitle }}</h3>
      </v-col>
    </div>

    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="recurso.catalogo_id"
              :items="catalogos"
              item-title="text"
              item-value="value"
              label="Almacen"
              variant="underlined"
              prepend-icon="mdi-storefront"
              required
              @change="cambiarCatalogo"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="recurso.no_inventario"
              label="No. de inventario"
          
              prepend-icon="mdi-format-list-numbered"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="recurso.nombre"
              label="Nombre"
              prepend-icon="mdi-label"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="recurso.tipo_recurso"
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
              v-model="recurso.marca"
              label="Marca"
              prepend-icon="mdi-tag"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="recurso.formula"
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
              v-model="recurso.pm"
              label="PM"
              prepend-icon="mdi-wrench"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="recurso.capacidad_r"
              label="Cantidad disponible"
              type="number"
              prepend-icon="mdi-barrel"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="recurso.recipientes_actuales"
              label="Recipientes actuales"
              type="number"
              prepend-icon="mdi-cup"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="recurso.lote"
              label="Lote"
              prepend-icon="mdi-barcode"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="recurso.unidad_medida"
               :items="['microlitros', 'mililitros', 'litros', 'microgramos', 'miligramos', 'gramos', 'kilogramos']"
              label="Unidad de medida"
              variant="underlined"
              prepend-icon="mdi-ruler-square"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              variant="underlined"
              v-model="recurso.fecha_caducidad"
              label="Fecha de caducidad"
              type="date"
              prepend-icon="mdi-calendar-range"
              required
            ></v-text-field>
           
          </v-col>
        </v-row>
        <p class="text-danger mt-1">Recuerda agregar nuevamente la fecha de caducidad para poder editar cualquier campo, de otra forma no será posible actualizar nigun campo.</p>
        <v-row justify="start" align="center" class="mt-4">
          <v-col cols="auto">
            <v-btn type="submit" color="primary">{{ submitText }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-form>
</template>
<script>
import backend from "@/backend.js";
import Swal from "sweetalert2";
import { AlmacenService } from "@/users/services/AlmacenService.js";

export default {
  data() {
    return {
      recurso: {
        id: "",
        catalogo_id: "",
        no_inventario: "",
        nombre: "",
        tipo_recurso: "",
        marca: "",
        pm: "",
        formula: "",
        capacidad_r: "",
        lote: "",
        recipientes_actuales: "",
        unidad_medida: "",
        fecha_caducidad: null,
      },
      catalogos: [],
      formTitle: "Editar Recurso",
      submitText: "Actualizar",
    };
  },
  computed: {
    mostrarAdvertencia() {
      return !this.recurso.fecha_caducidad;
    }
  },
  async mounted() {
    await this.cargarCatalogos();
    await this.cargarRecurso();
  },
  methods: {
    async cargarCatalogos() {
      try {
        const catalogos = await AlmacenService.all();
        this.catalogos = catalogos.map((catalogo) => ({
          value: catalogo.id,
          text: `${catalogo.id} - ${catalogo.nombre_almacen}`,
        }));
      } catch (error) {
        console.error("Error al cargar los almacenes:", error);
        Swal.fire({
          icon: "error",
          title: "Error al cargar almacenes",
          text: "Hubo un problema al cargar los almacenes. Por favor, inténtelo de nuevo.",
          confirmButtonText: '<span style="color:white;">OK</span>',
        });
      }
    },
    async cargarRecurso() {
      try {
        const recursoData = (
          await backend.get(`recursos/${this.$route.params.id}`)
        ).data;
        
        // Aseguramos que los campos específicos estén presentes en el recursoData
        this.recurso = {
          ...recursoData,
          unidad_medida: recursoData.unidad_medida || '',
          fecha_caducidad: new Date(recursoData.fecha_caducidad),
        };
      } catch (error) {
        console.error("Error al cargar el recurso:", error);
        Swal.fire({
          icon: "error",
          title: "Error al cargar el recurso",
          text: "Hubo un problema al cargar el recurso. Por favor, inténtelo de nuevo.",
          confirmButtonText: '<span style="color:white;">OK</span>',
        });
      }
    },
    async onSubmit() {
      try {
        await this.verificarFechaCaducidad();
        if (!this.recurso.id) {
          const newRecurso = await backend.post("recursos", this.recurso);
          this.$router.push({
            name: "recursos",
            params: { id: newRecurso.data.id },
          });
        } else {
          const response = await backend.patch(
            `recursos/${this.$route.params.id}`,
            this.recurso
          );
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Recurso actualizado con éxito",
            text: "El recurso ha sido actualizado exitosamente.",
            confirmButtonText: '<span style="color:white;">OK</span>',
          });
          this.$router.push({ name: "recursos" });
        }
      } catch (error) {
        console.error("Error al guardar/recuperar el recurso:", error);
        Swal.fire({
          icon: "error",
          title: "Error al guardar/recuperar el recurso",
          text: "Se recomienda verificar si se ingresó fecha.",
          confirmButtonText: '<span style="color:white;">OK</span>',
        });
      }
    },
    verificarFechaCaducidad() {
      if (!this.recurso.fecha_caducidad) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Recuerda agregar nuevamente la fecha de caducidad para poder editar cualquier campo.',
          confirmButtonText: '<span style="color:white;">OK</span>',
        });
      }
    },
    cambiarCatalogo() {
      this.recurso.catalogo_id = this.catalogos.find(c => c.value === this.recurso.catalogo_id)?.text || '';
    }
  },
};
</script>



<style scoped>
.material-symbols-outlined {
  cursor: pointer;
}
</style>
