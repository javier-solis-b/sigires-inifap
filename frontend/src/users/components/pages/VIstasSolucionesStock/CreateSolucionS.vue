<template>
  <form @submit.prevent="crearSolucion">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <div class="d-flex align-center mb-3">
      <v-btn icon @click="$router.push('/solucioness')" class="mr-2">
        <span class="material-symbols-outlined">arrow_back</span>
      </v-btn>
      <v-col class="encabezado" cols="12" sm="auto">
        <h3 class="fw-bold mb-0">Crear nueva solución stock</h3>
      </v-col>
    </div>
    <v-card>
      <v-container>
        <v-row>
          <!-- Nombre de la solución -->
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              variant="underlined"
              v-model="nombre_solucion"
              label="Nombre de la solución"
              prepend-icon="mdi-test-tube"
              required
            ></v-text-field>
          </v-col>
          <!-- Medio de cultivo -->
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              variant="underlined"
              v-model="medios_cultivo"
              label="Medios de cultivo"
              prepend-icon="mdi-flask-conical"
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- Recursos -->
        <div v-for="(recurso, index) in recursos" :key="index">
          <label :for="'recurso-' + index" class="form-label mb-2">{{ "Recurso " + (index + 1) }}</label>
          <div class="row">
            <v-col cols="8" sm="2" md="5">
              <v-select
                :id="'recurso-' + index"
                v-model="recurso.recurso_id"
                :items="listaRecursos"
                item-title="nombre"
                item-value="id"
                label="Recurso"
                prepend-icon="mdi-database"
                required
                @update:modelValue="onChangeRecurso(index)"
                filterable
                clearable
              ></v-select>
            </v-col>
            <v-col cols="8" sm="2" md="5">
              <v-text-field
                v-model="recurso.cantidad_usada"
                label="Cantidad Usada"
                type="number"
                step="0.01"
                prepend-icon="mdi-measurement-variant"
                required
                @input="convertirEnTiempoReal(index)"
              ></v-text-field>
              <!-- Etiqueta para mostrar la conversión -->
              <div v-if="recurso.conversion">
                <small class="text-muted">{{ recurso.conversion }}</small>
              </div>
            </v-col>
            <v-col cols="8" sm="2" md="5">
              <v-select
                v-model="recurso.unidad_medida"
                :items="obtenerUnidadesMedida(recurso.unidad_medida)"
                label="Unidad de Medida"
                prepend-icon="mdi-scale"
                required
                @update:modelValue="convertirEnTiempoReal(index)"
              ></v-select>
            </v-col>
            <v-col cols="8" sm="2" md="4">
              <div>
                <v-btn @click="eliminarRecurso(index)" color="error">
                  <span>Quitar</span>
                </v-btn>
              </div>
            </v-col>
          </div>
        </div>
        <!-- Botón Agregar Recurso -->
        <v-row justify="start" align="center" class="mt-3">
          <v-col cols="auto">
            <v-btn type="button" color="success" @click="agregarRecurso">Agregar Recurso</v-btn>
          </v-col>
        </v-row>
        <!-- Botón Crear Solución Stock -->
        <v-row justify="start" align="center" class="mt-3">
          <v-col cols="auto">
            <v-btn type="submit" color="primary">Crear solución stock</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </form>
</template>

<script>
import Swal from "sweetalert2";
import { RecursoService } from "@/users/services/RecursoService";

export default {
  data() {
    return {
      nombre_solucion: "",
      medios_cultivo: "",
      recursos: [{ recurso_id: null, cantidad_usada: "", unidad_medida: "", conversion: "" }],
      listaRecursos: [],
    };
  },

  async mounted() {
    await this.cargarRecursos();
  },

  methods: {
    async cargarRecursos() {
      try {
        const recursos = await RecursoService.all();
        this.listaRecursos = recursos.map((recurso) => ({
          id: recurso.id,
          nombre: `${recurso.nombre} - ${recurso.no_inventario} - ${recurso.unidad_medida}`,
          unidad_medida: recurso.unidad_medida,
        }));
      } catch (error) {
        console.error("Error al cargar los recursos:", error);
        Swal.fire({
          icon: "error",
          title: "Error al cargar recursos",
          text: "Hubo un problema al cargar los recursos. Por favor, inténtalo de nuevo.",
          confirmButtonText: '<span style="color:white;">OK</span>'
        });
      }
    },

    agregarRecurso() {
      this.recursos.push({ recurso_id: null, cantidad_usada: "", unidad_medida: "", conversion: "" });
    },

    eliminarRecurso(index) {
      this.recursos.splice(index, 1);
    },

    onChangeRecurso(index) {
      const recursoSeleccionado = this.listaRecursos.find(
        recurso => recurso.id === this.recursos[index].recurso_id
      );
      if (recursoSeleccionado) {
        this.recursos[index].unidad_medida = recursoSeleccionado.unidad_medida;
        this.convertirEnTiempoReal(index);
      }
    },

    obtenerUnidadesMedida(unidadMedidaRecurso) {
      const unidadesVolumen = ['litros', 'mililitros', 'microlitros'];
      const unidadesMasa = ['kilogramos', 'gramos', 'miligramos', 'microgramos'];
      
      if (unidadesVolumen.includes(unidadMedidaRecurso)) {
        return unidadesVolumen;
      } else if (unidadesMasa.includes(unidadMedidaRecurso)) {
        return unidadesMasa;
      } else {
        return [];
      }
    },

    esUnidadDeVolumen(unidad) {
      return ['litros', 'mililitros', 'microlitros'].includes(unidad.toLowerCase());
    },

    esUnidadDeMasa(unidad) {
      return ['kilogramos', 'gramos', 'miligramos', 'microgramos'].includes(unidad.toLowerCase());
    },

    convertirUnidad(cantidad, unidadOrigen, unidadDestino) {
      cantidad = parseFloat(cantidad);
      
      // Conversiones de volumen
      if (this.esUnidadDeVolumen(unidadOrigen)) {
        switch (unidadOrigen.toLowerCase()) {
          case 'litros':
            switch (unidadDestino.toLowerCase()) {
              case 'litros': return cantidad;
              case 'mililitros': return cantidad * 1000;
              case 'microlitros': return cantidad * 1000000;
              default: return cantidad;
            }
          case 'mililitros':
            switch (unidadDestino.toLowerCase()) {
              case 'litros': return cantidad * 0.001;
              case 'mililitros': return cantidad;
              case 'microlitros': return cantidad * 1000;
              default: return cantidad;
            }
          case 'microlitros':
            switch (unidadDestino.toLowerCase()) {
              case 'litros': return cantidad * 0.000001;
              case 'mililitros': return cantidad * 0.001;
              case 'microlitros': return cantidad;
              default: return cantidad;
            }
        }
      }
      // Conversiones de masa
      else if (this.esUnidadDeMasa(unidadOrigen)) {
        switch (unidadOrigen.toLowerCase()) {
          case 'gramos':
            switch (unidadDestino.toLowerCase()) {
              case 'gramos': return cantidad;
              case 'miligramos': return cantidad * 1000;
              case 'microgramos': return cantidad * 1000000;
              case 'kilogramos': return cantidad * 0.001;
              default: return cantidad;
            }
          case 'miligramos':
            switch (unidadDestino.toLowerCase()) {
              case 'kilogramos': return cantidad * 0.000001;
              case 'gramos': return cantidad * 0.001;
              case 'miligramos': return cantidad;
              case 'microgramos': return cantidad * 1000;
              default: return cantidad;
            }
          case 'microgramos':
            switch (unidadDestino.toLowerCase()) {
              case 'kilogramos': return cantidad * 0.000000001;
              case 'gramos': return cantidad * 0.000001;
              case 'miligramos': return cantidad * 0.001;
              case 'microgramos': return cantidad;
              default: return cantidad;
            }
          case 'kilogramos':
            switch (unidadDestino.toLowerCase()) {
              case 'kilogramos': return cantidad;
              case 'gramos': return cantidad * 1000;
              case 'miligramos': return cantidad * 1000000;
              case 'microgramos': return cantidad * 1000000000;
              default: return cantidad;
            }
        }
      }
      
      console.error(`Unidades no compatibles para conversión: ${unidadOrigen} -> ${unidadDestino}`);
      return cantidad;
    },

    convertirEnTiempoReal(index) {
      const recurso = this.recursos[index];
      if (recurso.recurso_id && recurso.cantidad_usada && recurso.unidad_medida) {
        const recursoSeleccionado = this.listaRecursos.find(r => r.id === recurso.recurso_id);
        const unidadBase = recursoSeleccionado?.unidad_medida || recurso.unidad_medida;

        if (this.esUnidadDeVolumen(unidadBase) || this.esUnidadDeMasa(unidadBase)) {
          const cantidadConvertida = this.convertirUnidad(recurso.cantidad_usada, recurso.unidad_medida, unidadBase);
          this.recursos[index].conversion = `Conversión de ${recurso.unidad_medida} a ${unidadBase}: ${cantidadConvertida} ${unidadBase}`;
        } else {
          this.recursos[index].conversion = "";
        }
      } else {
        this.recursos[index].conversion = "";
      }
    },

    async crearSolucion() {
      try {
        const recursosParseados = this.recursos.map(recurso => {
          const cantidadOriginal = parseFloat(recurso.cantidad_usada);
          let cantidadConvertida;
          
          // Determinar el tipo de unidad del recurso
          const recursoSeleccionado = this.listaRecursos.find(r => r.id === recurso.recurso_id);
          const unidadBase = recursoSeleccionado?.unidad_medida || recurso.unidad_medida;

          console.log(`Conversión para recurso ${recursoSeleccionado?.nombre}:`);
          console.log(`Cantidad original: ${cantidadOriginal} ${recurso.unidad_medida}`);
          console.log(`Unidad base del recurso: ${unidadBase}`);

          // Convertir según el tipo de unidad
          if (this.esUnidadDeVolumen(unidadBase)) {
            cantidadConvertida = this.convertirUnidad(cantidadOriginal, recurso.unidad_medida, unidadBase);
          } else if (this.esUnidadDeMasa(unidadBase)) {
            cantidadConvertida = this.convertirUnidad(cantidadOriginal, recurso.unidad_medida, unidadBase);
          } else {
            console.error(`Tipo de unidad no reconocido: ${unidadBase}`);
            cantidadConvertida = cantidadOriginal;
          }

          console.log(`Cantidad convertida: ${cantidadConvertida} ${unidadBase}`);

          return {
            recurso_id: recurso.recurso_id,
            cantidad_usada: cantidadConvertida,
            unidad_medida: unidadBase
          };
        });

        const datos = {
          nombre_solucion: this.nombre_solucion,
          medios_cultivo: this.medios_cultivo || null,
          recursos: recursosParseados
        };

        const response = await fetch('http://localhost:3000/api/v1/soluciones-stock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          console.error('Detalles del error:', errorDetails);
          throw new Error("Error al crear la solución");
        }

        const result = await response.json();
        console.log("Respuesta del servidor:", result);

        Swal.fire({
          icon: "success",
          title: "Solución creada con éxito",
          confirmButtonText: '<span style="color:white;">OK</span>'
        });
      } catch (error) {
        console.error("Error al crear la solución:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al crear la solución. Por favor, inténtalo de nuevo.",
          confirmButtonText: '<span style="color:white;">OK</span>'
        });
      }
    },

    limpiarFormulario() {
      this.nombre_solucion = "";
      this.medios_cultivo = "";
      this.recursos = [{ recurso_id: null, cantidad_usada: "", unidad_medida: "", conversion: "" }];
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-select {
  height: auto;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #c82333;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #495057;
}

.btn-primary {
  background-color: #1976d2;
  border-color: #1565c0;
}

.v-container {
  background-color: white;
}
</style>