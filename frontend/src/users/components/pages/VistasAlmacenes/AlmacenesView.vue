<template>
  <div class="container-fluid">
    <h3 class="fw-bold mb-3 text-color"  style="color: #0c934a">Almacenes.</h3>

    <!-- Filtro y selector para abrir el formulario flotante de agregación -->
    <div class="d-flex align-items-center mb-3">
      <input
        v-model="buscarPor"
        type="text"
        placeholder="Buscar por nombre..."
        class="form-control me-2"
      />
      <button
       v-if="isAdmin"
        @click="$router.push({ name: 'almacenes.create' })"
        class="btn btn-primary"
      >
        + Crear nuevo Almacén.
      </button>
    </div>

    <!-- Tabla de almacenes -->
    <table class="table table-striped table-bordered text-center">
      <thead>
        <tr>
          <th>ID</th>
          <th>Almacén</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(almacen, index) in resultadosBusqueda" :key="index">
          <td>{{ almacen.id }}</td>
          <td>{{ almacen.nombre_almacen || "-" }}</td>
          <td>
            <button
              @click="verContenidoAlmacen(almacen.id)"
              class="btn btn-sm btn-success me-2"
            >
              Ver contenido de este almacén
            </button>
            <button
              v-if="isAdmin"
              @click="editarAlmacen(almacen)"
              class="btn btn-sm btn-warning me-2"
            >
              Editar
            </button>
            <button
              v-if="isAdmin"
              @click="eliminarAlmacen(almacen)"
              class="btn btn-sm btn-danger"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Ventana modal para ver el contenido del almacén -->
    <v-dialog v-model="verModal" max-width="1200px">
      <v-card>
        <v-card-title> Contenido del Almacén </v-card-title>
        <v-card-text>
          <div class="table-responsive">
            <table class="table table-striped table-bordered text-center">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Almacén ID</th>
                  <th>No. de inventario</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Marca</th>
                  <th>Fórmula</th>
                  <th>PM</th>
                  <th>Capacidad recip.</th>
                  <th>Recipientes actuales</th>
                  <th>Lote</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(recurso, index) in recursosAlmacen" :key="index">
                  <td>{{ recurso.id }}</td>
                  <td>{{ recurso.catalogo_id }}</td>
                  <td>{{ recurso.no_inventario }}</td>
                  <td>{{ recurso.nombre }}</td>
                  <td>{{ recurso.tipo_recurso }}</td>
                  <td>{{ recurso.marca || "-" }}</td>
                  <td>{{ recurso.formula || "-" }}</td>
                  <td>{{ recurso.pm || "-" }}</td>
                  <td>{{ recurso.capacidad_r }}</td>
                  <td>{{ recurso.recipientes_actuales || "-" }}</td>
                  <td>{{ recurso.lote || "-" }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="cerrarModal">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Resultados de búsqueda -->
    <p v-if="resultadosBusqueda.length > 0" class="mt-3">
      Resultados de búsqueda: {{ resultadosBusqueda.length }} almacenes
      encontrados.
    </p>
  </div>
</template>

<script>
import { AlmacenService } from "@/users/services/AlmacenService";
import { RecursoService } from "@/users/services/RecursoService";
import { computed } from "vue";
import Swal from "sweetalert2";
import backend from "@/backend";

export default {
  data() {
    return {
      almacenes: [],
      buscarPor: "",
      resultadosBusqueda: [],
      verModal: false, // Para controlar la visibilidad de la ventana modal
      recursosAlmacen: [], // Almacenar los recursos del almacén seleccionado
    };
  },
  setup() {
    const isAdmin = computed(() => localStorage.getItem("isAdmin") === "true");

    return {
      isAdmin,
      // ... otros métodos y propiedades
    };
  },
  async mounted() {
    this.cargarAlmacenes();
  },
  methods: {
    async cargarAlmacenes() {
      try {
        const almacenes = await AlmacenService.all();
        this.almacenes = almacenes;
        this.resultadosBusqueda = almacenes;
      } catch (error) {
        console.error("Error al cargar almacenes:", error);
        alert(
          "Ha ocurrido un error al cargar los almacenes. Por favor, inténtelo nuevamente."
        );
      }
    },
    verAlmacen(almacen) {
      console.log("Ver contenido del almacén:", almacen);
      // Implementa la funcionalidad para ver el contenido del almacén
    },
    editarAlmacen(almacen) {
      console.log("Editar almacén:", almacen);
      // Implementa la funcionalidad para editar el almacén
      this.$router.push({ name: "almacenes.edit", params: { id: almacen.id } });
    },
    async eliminarAlmacen(almacen) {
  
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Quieres eliminar el almacen ${almacen.nombre_almacen}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: '<span style="color:white;">Sí, eliminar</span>',
        cancelButtonText: '<span style="color:white;">Cancelar</span>',
      });
      if (!result.isConfirmed) {
        return;
      }
      try {
        await backend.delete(`almacenes/${almacen.id}`);
        this.resultadosBusqueda = this.resultadosBusqueda.filter(
          (r) => r.id !== almacen.id
        );
        Swal.fire({
          icon: "success",
          title: "¡Almacen eliminado exitosamente!",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Error al eliminar recurso:", error);
        Swal.fire({
          icon: "error",
          title: "Error al eliminar almacen",
          text: "NO se puede eliminar el almacen debido a que tiene recursos u otra tabla relacionada.",
        });
      }
    },
    buscarPorNombre() {
      if (this.buscarPor.trim()) {
        this.resultadosBusqueda = this.almacenes.filter((almacen) =>
          almacen.nombre_almacen
            .toLowerCase()
            .includes(this.buscarPor.toLowerCase())
        );
      } else {
        this.resultadosBusqueda = this.almacenes;
      }
    },
    async verContenidoAlmacen(catalogoId) {
      try {
        const recursos = await RecursoService.all();
        //const recursos = await AlmacenService.all();
        this.recursosAlmacen = recursos.filter(
          (recurso) => recurso.catalogo_id === catalogoId
        );
        this.verModal = true;
      } catch (error) {
        console.error("Error al cargar los recursos del almacén:", error);
        alert(
          "Ha ocurrido un error al cargar los recursos del almacén. Por favor, inténtelo nuevamente."
        );
      }
    },
    cerrarModal() {
      this.verModal = false;
    },
  },
  watch: {
    buscarPor: {
      handler() {
        this.buscarPorNombre();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.table-bordered {
  width: 100%;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #dee2e6;
  vertical-align: middle;
  text-align: center; /* Centrar el contenido de las columnas */
}

@media (max-width: 768px) {
  .table-bordered th,
  .table-bordered td {
    white-space: nowrap;
  }

  .table-bordered th:first-child,
  .table-bordered td:first-child {
    width: 25%;
  }

  .table-bordered th:nth-child(2),
  .table-bordered td:nth-child(2) {
    width: 50%;
  }

  .table-bordered th:last-child,
  .table-bordered td:last-child {
    width: 25%;
  }
}

.container-fluid {
  padding: 0 15px;
}

@media (max-width: 768px) {
  .table th,
  .table td {
    white-space: nowrap;
  }
}

#recursos-view {
  max-width: 1200px;
  margin: 0 auto;
}

nav ul {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

nav li {
  margin-right: 20px;
}

nav a {
  text-decoration: none;
  color: #333;
}

.router-link-active {
  font-weight: bold;
  color: #007bff;
}

.table-responsive {
  max-height: 600px; /* Ajusta esta altura según sea necesario */
  overflow-y: auto;
}

.v-dialog__content {
  max-width: 100%;
}

.v-dialog .v-card {
  max-width: 100%;
}

.v-card-text {
  padding: 16px;
}
</style>
