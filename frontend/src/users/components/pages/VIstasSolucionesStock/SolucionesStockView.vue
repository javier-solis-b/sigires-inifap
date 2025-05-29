<template>
  <div class="container-fluid">
    <h3 class="fw-bold mb-3 text-color" style="color: #0c934a">
      Soluciones Stock y Recursos
    </h3>
    <!-- Filtro y botón para añadir soluciones -->
    <div class="d-flex align-items-center mb-3">
      <input
        v-model="buscarPor"
        type="text"
        placeholder="Buscar por nombre de la solución..."
        class="form-control me-2"
      />
      <select v-model="filtroMedioCultivo" class="form-control me-2">
        <option value="">Todos los medios de cultivo</option>
        <option
          v-for="medio in mediosCultivoUnicos"
          :key="medio"
          :value="medio"
        >
          {{ medio || "Sin medio de cultivo" }}
        </option>
      </select>
      <button
        v-if="isAdmin"
        @click="$router.push({ name: 'solucioness.create' })"
        class="btn btn-primary"
      >
        + Crear solución stock
      </button>
    </div>
    <p v-if="!isAdmin" class="alert alert-info" style="font-size: 14px;">
      Para este usuario solo se permite editar la solución para pruebas en
      descuentos de stock. Edita conforme necesites hacer tus pruebas.
    </p>
    <!-- Tabla de Soluciones de Stock y Recursos -->
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Medio de cultivo</th>
          <th>Nombre de la Solución</th>
          <th>Recursos</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="solucion in solucionesFiltradas" :key="solucion.id">
          <td>{{ solucion.id }}</td>
          <td>{{ solucion.medios_cultivo }}</td>
          <td>{{ solucion.nombre_solucion }}</td>
          <td>
            <div
              v-for="recurso in solucion.recursos"
              :key="recurso.id"
              style="color: #5a5a5a"
            >
              {{ recurso.nombre }}:
              {{
                convertirUnidad(recurso.cantidad_usada, recurso.unidad_medida)
              }}
            </div>
          </td>
          <td>
            <button
              @click="usarSolucion(solucion.id)"
              class="btn btn-success me-2"
            >
              Usar esta solución
            </button>
            <button
              @click="
                $router.push({
                  name: 'soluciones.edit',
                  params: { id: solucion.id },
                })
              "
              class="btn btn-warning me-2"
              style="background-color: yellow"
            >
              Editar
            </button>
            <button
              v-if="isAdmin"
              @click="eliminarSolucion(solucion.id)"
              class="btn btn-danger me-2"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import { SolucionStockService } from "@/users/services/SolucionStockService.js";
import { SolucionRecursosService } from "@/users/services/SolucionRecursosService.js";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

export default {
  setup() {
    const isAdmin = computed(() => localStorage.getItem("isAdmin") === "true");
    const buscarPor = ref("");
    const soluciones = ref([]);
    const filtroMedioCultivo = ref("");
    const toast = useToast();

    // Obtener medios de cultivo únicos
    const mediosCultivoUnicos = computed(() => {
      const medios = new Set();
      soluciones.value.forEach((sol) => {
        if (sol.medios_cultivo) {
          medios.add(sol.medios_cultivo);
        }
      });
      return Array.from(medios).sort();
    });

    // Función para cargar soluciones con recursos
    const fetchSolucionesConRecursos = async () => {
      try {
        const solucionesResponse = await SolucionStockService.all();
        const recursosResponse = await SolucionRecursosService.all();
        // Mapear soluciones con sus recursos
        soluciones.value = solucionesResponse.map((solucion) => {
          solucion.recursos = recursosResponse.filter(
            (recurso) => recurso.solucion_id === solucion.id
          );
          return solucion;
        });
      } catch (error) {
        console.error("Error fetching soluciones with recursos:", error);
        toast.error("Error al cargar las soluciones y recursos");
      }
    };

    // Función para eliminar una solución
    const eliminarSolucion = async (id) => {
      if (!isAdmin.value) {
        // Redirigir si no es admin
        window.location = '/NoPermisos';
        return;
      }
      const confirmacion = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "swal2-confirm",
          cancelButton: "swal2-cancel",
        },
      });

      if (confirmacion.isConfirmed) {
        try {
          await SolucionStockService.delete(id);
          Swal.fire("¡Eliminado!", "La solución ha sido eliminada.", "success");
          // Recargar la lista de soluciones después de eliminar
          fetchSolucionesConRecursos();
        } catch (error) {
          console.error("Error al eliminar la solución:", error);
          Swal.fire("Error", "No se pudo eliminar la solución.", "error");
        }
      }
    };

    // Función para usar una solución
    const usarSolucion = async (solucion_id) => {
  try {
    const confirmacion = await Swal.fire({
      title: "¿Usar esta solución?",
      text: "¿Estás seguro de que deseas usar esta solución?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, usar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      await SolucionStockService.usarSolucion(solucion_id);
      Swal.fire("¡Éxito!", "La solución ha sido usada correctamente.", "success");
      // Recargar datos si es necesario
      fetchSolucionesConRecursos();
    }
  } catch (error) {
    if (error.message) {
      // Error de recursos insuficientes
      Swal.fire({
        title: "No se puede usar la solución",
        html: `<strong>${error.message}</strong><br>
               Disponible: ${error.disponible} ${error.unidad_medida || ''}<br>
               Requerido: ${error.requerido} ${error.unidad_medida || ''}`,
        icon: "error",
      });
    } else {
      // Otros errores
      Swal.fire("Error", "Ocurrió un error al usar la solución.", "error");
      console.error("Error al usar solución:", error);
    }
  }
};

    // Filtrar soluciones por nombre y medio de cultivo
    const solucionesFiltradas = computed(() => {
      return soluciones.value.filter((solucion) => {
        const nombreMatch =
          !buscarPor.value ||
          solucion.nombre_solucion
            .toLowerCase()
            .includes(buscarPor.value.toLowerCase());
        const medioMatch =
          !filtroMedioCultivo.value ||
          solucion.medios_cultivo === filtroMedioCultivo.value;
        return nombreMatch && medioMatch;
      });
    });

    // Cargar datos al montar el componente
    onMounted(fetchSolucionesConRecursos);

    // Función para convertir unidades
    const convertirUnidad = (cantidad, unidadMedida) => {
      const unidadesVolumen = ["litros", "mililitros", "microlitros"];
      const unidadesMasa = [
        "kilogramos",
        "gramos",
        "miligramos",
        "microgramos",
      ];

      if (unidadesVolumen.includes(unidadMedida)) {
        // Conversiones de volumen
        switch (unidadMedida) {
          case "litros":
            return `${cantidad} L`;
          case "mililitros":
            return `${cantidad} mL`;
          case "microlitros":
            return `${cantidad} µL`;
          default:
            return `${cantidad}`;
        }
      } else if (unidadesMasa.includes(unidadMedida)) {
        // Conversiones de masa
        switch (unidadMedida) {
          case "kilogramos":
            return `${cantidad} kg`;
          case "gramos":
            return `${cantidad} g`;
          case "miligramos":
            return `${cantidad} mg`;
          case "microgramos":
            return `${cantidad} µg`;
          default:
            return `${cantidad}`;
        }
      } else {
        return `${cantidad}`; // Mantener la cantidad para unidades no especificadas
      }
    };

    return {
      isAdmin,
      buscarPor,
      soluciones,
      filtroMedioCultivo,
      mediosCultivoUnicos,
      solucionesFiltradas,
      usarSolucion,
      eliminarSolucion,
      convertirUnidad,
    };
  },
};
</script>

<style scoped>
.text-color {
  color: #0c934a;
}

/* Estilos para los botones de SweetAlert2 */
.swal2-confirm,
.swal2-cancel {
  color: white !important; /* Texto en blanco */
}
</style>