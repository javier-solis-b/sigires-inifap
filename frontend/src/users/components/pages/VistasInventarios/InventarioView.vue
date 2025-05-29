<template>
  <div>
    <h3 class="fw-bold mb-0 text-color" style="color: #0c934a">Inventario</h3>
    <br />
    <!-- Filtro y selector -->
    <div class="mb-3 d-flex align-items-center">
      <input
        v-model="buscarPor"
        type="text"
        placeholder="Buscar por nombre..."
        class="form-control w-50"
      />
      <span class="ms-2">Filtrar por tipo: </span>
      <select
        v-model="filtroSeleccionado"
        class="form-select me-2"
        @change="filtrarRecursos"
      >
        <option value="todos">Todos</option>
        <option value="solvente">Solventes</option>
        <option value="reactivo">Reactivos</option>
        <option value="solución">Soluciones</option>
      </select>
    </div>
    <!-- Etiqueta de ayuda para el usuario -->
    <p class="alert alert-info" style="font-size: 14px;">
      Escriba un valor en "Cantidad disponible" para poder sumar o restar stock.
    </p>
    <!-- Tabla de recursos -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Almacén</th>
          <th>No. inventario</th>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Fórmula</th>
          <th>Cantidad disponible</th>
          <th>Recipientes</th>
          <th>Caducidad</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(resource, index) in resultadosBusqueda" 
          :key="index" 
          :class="{ 
            'table-danger': resource.capacidad_r <= 0 || resource.recipientes_actuales <= 0,
            'table-warning': resource.capacidad_r > 0 && resource.capacidad_r < 5 // Opcional: alerta para bajos niveles
          }"
        >
          <td>{{ resource.id }}</td>
          <td>{{ resource.almacen || "-" }}</td>
          <td>{{ resource.no_inventario }}</td>
          <td>{{ resource.nombre }}</td>
          <td>{{ resource.tipo_recurso }}</td>
          <td>{{ resource.formula || "-" }}</td>
          <td>
            <div class="d-flex align-items-center">
              {{ resource.capacidad_r }} {{ resource.unidad_medida }}
              <div class="d-flex ms-2 align-items-center">
                <input
                  v-model.number="resource.cantidadInput"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-control form-control-sm me-2"
                  placeholder="Cantidad"
                  style="width: 90px"
                  :class="{ 'is-invalid': resource.cantidadInput < 0 }"
                />
                <button
                  @click="actualizarCantidad(resource.id, 'sumar')"
                  class="btn btn-success btn-sm me-1"
                  :disabled="resource.cantidadInput <= 0"
                >
                  +
                </button>
                <button
                  @click="actualizarCantidad(resource.id, 'restar')"
                  class="btn btn-danger btn-sm"
                  :disabled="resource.cantidadInput <= 0"
                >
                  -
                </button>
              </div>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center">
              {{ resource.recipientes_actuales || "-" }}
              <div class="d-flex ms-2 align-items-center">
                <button
                  @click="actualizarRecipientes(resource.id, 'agregar')"
                  class="btn btn-success btn-sm me-1"
                >
                  +
                </button>
                <button
                  @click="actualizarRecipientes(resource.id, 'quitar')"
                  class="btn btn-danger btn-sm"
                  :disabled="resource.recipientes_actuales <= 0"
                >
                  -
                </button>
              </div>
            </div>
          </td>
          <td>{{ resource.fecha_caducidad || "-" }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="resultadosBusqueda.length > 0" class="mt-3">
      Resultados de búsqueda: {{ resultadosBusqueda.length }} recursos encontrados.
    </p>
  </div>
</template>

<script>
import { RecursoService } from "@/users/services/RecursoService";
import { computed } from "vue";
import backend from "@/backend";

export default {
  data() {
    return {
      recursos: [],
      buscarPor: "",
      filtroSeleccionado: "todos",
      resultadosBusqueda: []
    };
  },
  setup() {
    const isAdmin = computed(() => localStorage.getItem("isAdmin") === "true");
    return { isAdmin };
  },
  async mounted() {
    await this.cargarRecursos();
  },
  methods: {
    async cargarRecursos() {
      try {
        const recursos = await RecursoService.all();
        this.recursos = recursos.map(resource => ({
          ...resource,
          cantidadInput: 0,
          recipientes_actuales: resource.recipientes_actuales || 0,
          capacidad_r: resource.capacidad_r || 0
        }));
        this.resultadosBusqueda = [...this.recursos];
      } catch (error) {
        console.error("Error al cargar recursos:", error);
        alert("Error al cargar los recursos. Por favor, inténtelo nuevamente.");
      }
    },

    async actualizarCantidad(id, accion) {
      const recurso = this.resultadosBusqueda.find(r => r.id === id);
      if (!recurso) {
        console.error("Recurso no encontrado");
        return;
      }

      const cantidad = Number(recurso.cantidadInput);
      
      // Validaciones
      if (isNaN(cantidad)) {
        alert("Por favor ingrese un número válido");
        return;
      }

      if (cantidad <= 0) {
        alert("La cantidad debe ser mayor que cero");
        return;
      }

      if (accion === "restar" && cantidad > recurso.capacidad_r) {
        alert(`No puede quitar ${cantidad} porque solo hay ${recurso.capacidad_r} en stock`);
        return;
      }

      try {
        // Calcular nueva cantidad
        const nuevaCantidad = accion === "sumar" 
          ? recurso.capacidad_r + cantidad 
          : recurso.capacidad_r - cantidad;

        // Actualizar backend
        const response = await backend.patch(`/recursos/${id}`, {
          capacidad_r: nuevaCantidad
        });

        if (response.status === 200) {
          // Actualizar frontend
          recurso.capacidad_r = nuevaCantidad;
          recurso.cantidadInput = 0;
          
          // Mostrar feedback
          const action = accion === "sumar" ? "añadido" : "quitado";
          alert(`Se ha ${action} ${cantidad} ${recurso.unidad_medida} correctamente. Stock actual: ${nuevaCantidad}`);
        } else {
          throw new Error("Error al actualizar en el servidor");
        }
      } catch (error) {
        console.error("Error al actualizar cantidad:", error);
        alert("Error al actualizar la cantidad. Por favor, inténtelo nuevamente.");
      }
    },

    async actualizarRecipientes(id, accion) {
      const recurso = this.resultadosBusqueda.find(r => r.id === id);
      if (!recurso) {
        console.error("Recurso no encontrado");
        return;
      }

      // Validar antes de quitar
      if (accion === "quitar" && recurso.recipientes_actuales <= 0) {
        alert("No hay recipientes para quitar");
        return;
      }

      const confirmacion = confirm(`¿Está seguro que desea ${accion === 'agregar' ? 'agregar' : 'quitar'} un recipiente?`);
      if (!confirmacion) return;

      try {
        // Calcular nuevo total
        const nuevosRecipientes = accion === "agregar" 
          ? recurso.recipientes_actuales + 1 
          : recurso.recipientes_actuales - 1;

        // Actualizar backend
        const response = await backend.patch(`/recursos/${id}`, {
          recipientes_actuales: nuevosRecipientes
        });

        if (response.status === 200) {
          // Actualizar frontend
          recurso.recipientes_actuales = nuevosRecipientes;
          alert(`Recipientes actualizados. Total: ${nuevosRecipientes}`);
        } else {
          throw new Error("Error al actualizar en el servidor");
        }
      } catch (error) {
        console.error("Error al actualizar recipientes:", error);
        alert("Error al actualizar los recipientes. Por favor, inténtelo nuevamente.");
      }
    },

    buscarPorNombre() {
      if (this.buscarPor.trim()) {
        this.resultadosBusqueda = this.recursos.filter(resource =>
          resource.nombre.toLowerCase().includes(this.buscarPor.toLowerCase())
        );
      } else {
        this.resultadosBusqueda = [...this.recursos];
      }
    },

    filtrarRecursos() {
      if (this.filtroSeleccionado === "todos") {
        this.buscarPorNombre();
      } else {
        this.resultadosBusqueda = this.recursos.filter(
          resource =>
            resource.tipo_recurso.toLowerCase() === this.filtroSeleccionado &&
            resource.nombre.toLowerCase().includes(this.buscarPor.toLowerCase())
        );
      }
    }
  },
  watch: {
    buscarPor() {
      this.buscarPorNombre();
    },
    filtroSeleccionado() {
      this.filtrarRecursos();
    }
  }
};
</script>

<style scoped>
/* Estilos para el formulario flotante */
.table-danger {
  background-color: #f8d7da !important;
}
.table-warning {
  background-color: #fff3cd !important;
}
.is-invalid {
  border-color: #dc3545;
}

.agregacion-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  y4: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow-y: scroll;
  overflow-x: hidden;
}

.agregacion-form-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 95%; /* Ajusta según sea necesario */

  max-width: 600px;
  position: relative;
}

/* Transición para el formulario flotante */
.form-transition-enter-active,
.form-transition-leave-active {
  transition: opacity 0.3s ease;
}

.form-transition-enter,
.form-transition-leave-to {
  opacity: 0;
}

/* Resto de estilos */
.table {
  font-size: 12px;
}

.btn {
  padding: 5px 10px;
}

.form-select {
  width: 200px;
}
</style>
