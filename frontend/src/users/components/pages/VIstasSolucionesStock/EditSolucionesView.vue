<template>
  <div class="container-fluid">
    <!-- Botón de regresar -->
    <div class="d-flex align-center mb-3">
      <v-btn icon @click="$router.push('/solucioness')" class="mr-2">
        <span class="material-symbols-outlined">⬅</span>
      </v-btn>
      <h3 class="fw-bold mb-0 text-color" style="color: #0c934a">
        Editar Solución
      </h3>
    </div>

    <form @submit.prevent="guardarCambios">
      <!-- Campos de la solución -->
      <div class="mb-3">
        <label for="medios_cultivo" class="form-label">Medio de Cultivo</label>
        <input
          type="text"
          class="form-control"
          id="medios_cultivo"
          v-model="solucion.medios_cultivo"
        />
      </div>
      <div class="mb-3">
        <label for="nombre_solucion" class="form-label">Nombre de la Solución</label>
        <input
          type="text"
          class="form-control"
          id="nombre_solucion"
          v-model="solucion.nombre_solucion"
        />
      </div>

      <!-- Lista de recursos asociados -->
      <div class="mb-3">
        <h5>Recursos Asociados</h5>
        <div v-for="(recurso, index) in solucion.recursos" :key="index" class="mb-4">
          <div class="row">
            <!-- Campo de recurso -->
            <div class="col-md-4">
              <label :for="'recurso-' + index" class="form-label">Recurso</label>
              <select
                :id="'recurso-' + index"
                class="form-select"
                v-model="recurso.recurso_id"
                @change="onChangeRecurso(index)"
              >
                <option v-for="item in listaRecursos" :key="item.id" :value="item.id">
                  {{ item.nombre }}
                </option>
              </select>
            </div>

            <!-- Campo de cantidad usada -->
            <div class="col-md-3">
              <label :for="'cantidad-' + index" class="form-label">Cantidad Usada</label>
              <input
                :id="'cantidad-' + index"
                type="number"
                class="form-control"
                v-model="recurso.cantidad_usada"
                step="0.00000000000001" 
                @input="convertirEnTiempoReal(index)"
              />
              <!-- Etiqueta para mostrar la conversión -->
              <div v-if="recurso.conversion" class="mt-2">
                <small class="text-muted">{{ recurso.conversion }}</small>
              </div>
            </div>

            <!-- Campo de unidad de medida -->
            <div class="col-md-3">
              <label :for="'unidad-' + index" class="form-label">Unidad de Medida</label>
              <select
                :id="'unidad-' + index"
                class="form-select"
                v-model="recurso.unidad_medida"
                @change="convertirEnTiempoReal(index)"
              >
                <option v-for="unidad in obtenerUnidadesMedida(recurso.unidad_medida)" :key="unidad" :value="unidad">
                  {{ unidad }}
                </option>
              </select>
            </div>

            <!-- Botón para eliminar recurso -->
            <div class="col-md-2 d-flex align-items-end">
              <button type="button" class="btn btn-danger" @click="eliminarRecurso(index)">
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Botón para agregar recurso -->
        <div class="mt-3">
          <button type="button" class="btn btn-success" @click="agregarRecurso">
            Agregar Recurso
          </button>
        </div>
      </div>

      <!-- Botones -->
      <div class="mt-4">
        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        <button type="button" class="btn btn-secondary ms-2" @click="cancelarEdicion">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SolucionStockService } from '@/users/services/SolucionStockService.js';
import { RecursoService } from '@/users/services/RecursoService';
import Swal from 'sweetalert2'; // Importar SweetAlert2

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const solucion = ref({
      medios_cultivo: '',
      nombre_solucion: '',
      recursos: [], // Array para almacenar los recursos asociados
    });
    const listaRecursos = ref([]); // Lista de recursos disponibles

    // Función para regresar a la página anterior
    const regresar = () => {
      router.go(-1); // Regresar a la página anterior
    };

    // Función para cargar la solución con sus recursos
    const cargarSolucion = async () => {
      try {
        const id = route.params.id;
        const response = await SolucionStockService.getWithResources(id);
        solucion.value = response; // Asignar los datos de la solución y sus recursos

        // Actualizar las unidades de medida y las conversiones para cada recurso
        solucion.value.recursos.forEach((recurso, index) => {
          if (recurso.recurso_id) {
            const recursoSeleccionado = listaRecursos.value.find(
              (r) => r.id === recurso.recurso_id
            );
            if (recursoSeleccionado) {
              recurso.unidad_medida = recursoSeleccionado.unidad_medida;
              convertirEnTiempoReal(index); // Actualizar la conversión
            }
          }
        });
      } catch (error) {
        console.error('Error cargando la solución:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar la solución. Por favor, inténtalo de nuevo.',
        });
      }
    };

    // Función para cargar los recursos disponibles
    const cargarRecursos = async () => {
      try {
        const recursos = await RecursoService.all();
        listaRecursos.value = recursos.map((recurso) => ({
          id: recurso.id,
          nombre: `${recurso.nombre} - ${recurso.no_inventario} - ${recurso.unidad_medida}`,
          unidad_medida: recurso.unidad_medida,
        }));
      } catch (error) {
        console.error('Error cargando los recursos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cargar los recursos. Por favor, inténtalo de nuevo.',
        });
      }
    };

    // Función para agregar un nuevo recurso
    const agregarRecurso = () => {
      solucion.value.recursos.push({
        recurso_id: null,
        cantidad_usada: '',
        unidad_medida: '',
        conversion: '',
      });
    };

    // Función para eliminar un recurso
    const eliminarRecurso = (index) => {
      solucion.value.recursos.splice(index, 1);
    };

    // Función para manejar el cambio de recurso seleccionado
    const onChangeRecurso = (index) => {
      const recursoSeleccionado = listaRecursos.value.find(
        (recurso) => recurso.id === solucion.value.recursos[index].recurso_id
      );
      if (recursoSeleccionado) {
        solucion.value.recursos[index].unidad_medida = recursoSeleccionado.unidad_medida;
        convertirEnTiempoReal(index);
      }
    };

    // Función para obtener las unidades de medida según el tipo
    const obtenerUnidadesMedida = (unidadMedidaRecurso) => {
      const unidadesVolumen = ['litros', 'mililitros', 'microlitros'];
      const unidadesMasa = ['kilogramos', 'gramos', 'miligramos', 'microgramos'];
      if (unidadesVolumen.includes(unidadMedidaRecurso)) {
        return unidadesVolumen;
      } else if (unidadesMasa.includes(unidadMedidaRecurso)) {
        return unidadesMasa;
      } else {
        return [];
      }
    };

    // Función para convertir en tiempo real
    const convertirEnTiempoReal = (index) => {
      const recurso = solucion.value.recursos[index];
      if (recurso.recurso_id && recurso.cantidad_usada && recurso.unidad_medida) {
        const recursoSeleccionado = listaRecursos.value.find(
          (r) => r.id === recurso.recurso_id
        );
        const unidadBase = recursoSeleccionado?.unidad_medida || recurso.unidad_medida;

        if (esUnidadDeVolumen(unidadBase) || esUnidadDeMasa(unidadBase)) {
          const cantidadConvertida = convertirUnidad(
            recurso.cantidad_usada,
            recurso.unidad_medida,
            unidadBase
          );
          recurso.conversion = `Conversión de ${recurso.unidad_medida} a ${unidadBase}: ${cantidadConvertida} ${unidadBase}`;
        } else {
          recurso.conversion = '';
        }
      } else {
        recurso.conversion = '';
      }
    };

    // Funciones de utilidad para conversiones
    const esUnidadDeVolumen = (unidad) => {
      return ['litros', 'mililitros', 'microlitros'].includes(unidad.toLowerCase());
    };

    const esUnidadDeMasa = (unidad) => {
      return ['kilogramos', 'gramos', 'miligramos', 'microgramos'].includes(unidad.toLowerCase());
    };

    const convertirUnidad = (cantidad, unidadOrigen, unidadDestino) => {
      cantidad = parseFloat(cantidad);
      // Conversiones de volumen
      if (esUnidadDeVolumen(unidadOrigen)) {
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
      else if (esUnidadDeMasa(unidadOrigen)) {
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
    };

    const guardarCambios = async () => {
      try {
        const id = route.params.id;

        // Preparar los datos para enviar al servicio
        const datosParaEnviar = {
          medios_cultivo: solucion.value.medios_cultivo,
          nombre_solucion: solucion.value.nombre_solucion,
          recursos: solucion.value.recursos.map((recurso) => {
            const recursoSeleccionado = listaRecursos.value.find(
              (r) => r.id === recurso.recurso_id
            );
            const unidadBase = recursoSeleccionado?.unidad_medida || recurso.unidad_medida;

            // Convertir la cantidad a la unidad base
            const cantidadConvertida = convertirUnidad(
              recurso.cantidad_usada,
              recurso.unidad_medida,
              unidadBase
            );

            return {
              recurso_id: recurso.recurso_id,
              cantidad_usada: cantidadConvertida,
              unidad_medida: unidadBase,
            };
          }),
        };

        // Llamar al servicio para actualizar la solución y sus recursos
        await SolucionStockService.update(id, datosParaEnviar);

        // Mostrar mensaje de éxito en una ventana emergente
        await Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La solución se ha actualizado correctamente.',
          confirmButtonText: 'Aceptar',
        });

        // Redirigir a la lista de soluciones
        router.push({ name: 'solucioness' });
      } catch (error) {
        console.error('Error actualizando la solución:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar la solución. Por favor, inténtalo de nuevo.',
        });
      }
    };

    // Función para cancelar la edición
    const cancelarEdicion = () => {
      router.push({ name: 'solucioness' });
    };

    // Cargar los datos al montar el componente
    onMounted(async () => {
      await cargarRecursos(); // Primero cargar los recursos disponibles
      await cargarSolucion(); // Luego cargar la solución con sus recursos
    });

    return {
      solucion,
      listaRecursos,
      regresar,
      agregarRecurso,
      eliminarRecurso,
      onChangeRecurso,
      obtenerUnidadesMedida,
      convertirEnTiempoReal,
      guardarCambios,
      cancelarEdicion,
    };
  },
};
</script>

<style scoped>
.text-color {
  color: #0c934a;
}
</style>