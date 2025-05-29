<template>
  <div class="dashboard-bg py-4">
    <div class="container-fluid p-0">
      <!-- KPIs -->
      <div class="row justify-content-center mb-4">
        <div class="col-md-3 mb-3" v-for="kpi in kpis" :key="kpi.label">
          <div class="kpi-card shadow">
            <div class="kpi-icon" :style="{background: kpi.bg}">
              <i :class="kpi.icon"></i>
            </div>
            <div>
              <div class="kpi-value">{{ kpi.value }}</div>
              <div class="kpi-label">{{ kpi.label }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Gráficas -->
      <div class="row justify-content-center">
        <div class="col-md-6 mb-4">
          <div class="card shadow-lg bg-white rounded chart-card animate__animated animate__fadeInLeft">
            <div class="card-header border-0 bg-transparent">
              <h5 class="mb-0 text-success"><i class="fas fa-warehouse me-2"></i>Gráfica de Almacenes</h5>
            </div>
            <div class="card-body">
              <canvas id="almacenChart"></canvas>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-4">
          <div class="card shadow-lg bg-white rounded chart-card animate__animated animate__fadeInRight">
            <div class="card-header border-0 bg-transparent">
              <h5 class="mb-0 text-primary"><i class="fas fa-chart-pie me-2"></i>Distribución de Tipos de Recursos</h5>
            </div>
            <div class="card-body">
              <canvas id="tipoRecursoChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WebFont from "webfontloader";
import Chart from 'chart.js/auto';
import { AlmacenService } from "@/users/services/AlmacenService";
import { RecursoService } from "@/users/services/RecursoService";

export default {
  name: "DashboardView",
  data() {
    return {
      almacenes: [],
      recursos: [],
      kpis: [
        { label: 'Almacenes', value: 0, icon: 'fas fa-warehouse', bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
        { label: 'Recursos', value: 0, icon: 'fas fa-boxes', bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
        { label: 'Tipos de Recursos', value: 0, icon: 'fas fa-tags', bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' },
      ],
    };
  },
  async mounted() {
    WebFont.load({
      google: { families: ["Public Sans:300,400,500,600,700"] },
      custom: {
        families: [
          "Font Awesome 5 Solid",
          "Font Awesome 5 Regular",
          "Font Awesome 5 Brands",
          "simple-line-icons",
        ],
        urls: ["assets/css/fonts.min.css"],
      },
      active: function () {
        sessionStorage.fonts = true;
      },
    });
    await this.cargarDatos();
    this.generarGraficaAlmacenes();
    this.generarGraficaTiposRecursos();
    this.setKPIs();
  },
  methods: {
    navigateToUsers() {
      this.$router.push('/usuarios');
    },
    async cargarDatos() {
      try {
        this.almacenes = await AlmacenService.all();
        this.recursos = await RecursoService.all();
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    },
    setKPIs() {
      this.kpis[0].value = this.almacenes.length;
      this.kpis[1].value = this.recursos.length;
      this.kpis[2].value = new Set(this.recursos.map(r => r.tipo_recurso)).size;
    },
    generarGraficaAlmacenes() {
      const ctx = document.getElementById('almacenChart').getContext('2d');
      const almacenesData = this.almacenes.map(almacen => {
        return {
          nombre: almacen.nombre_almacen,
          cantidad: this.recursos.filter(recurso => recurso.catalogo_id === almacen.id).length
        };
      });
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: almacenesData.map(almacen => almacen.nombre),
          datasets: [{
            label: 'Cantidad de Recursos',
            data: almacenesData.map(almacen => almacen.cantidad),
            backgroundColor: almacenesData.map((_, i) => `rgba(${54 + i*30}, ${162 - i*10}, 235, 0.8)`),
            borderColor: almacenesData.map((_, i) => `rgba(${54 + i*30}, ${162 - i*10}, 235, 1)`),
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: 'rgba(12, 147, 74, 0.8)',
            hoverBorderColor: 'rgba(12, 147, 74, 1)'
          }]
        },
        options: {
          responsive: true,
          animation: {
            duration: 1200,
            easing: 'easeInOutQuart'
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0c934a',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#fff',
              borderWidth: 1
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#e0e0e0' },
              ticks: { color: '#0c934a', font: { weight: 'bold' } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#0c934a', font: { weight: 'bold' } }
            }
          }
        }
      });
    },
    generarGraficaTiposRecursos() {
      const ctx = document.getElementById('tipoRecursoChart').getContext('2d');
      const tiposRecursoData = this.recursos.reduce((acc, recurso) => {
        acc[recurso.tipo_recurso] = (acc[recurso.tipo_recurso] || 0) + 1;
        return acc;
      }, {});
      const colors = [
        'rgba(255, 99, 132, 0.9)',
        'rgba(54, 162, 235, 0.9)',
        'rgba(255, 206, 86, 0.9)',
        'rgba(75, 192, 192, 0.9)',
        'rgba(153, 102, 255, 0.9)',
        'rgba(255, 159, 64, 0.9)'
      ];
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(tiposRecursoData),
          datasets: [{
            label: 'Distribución de Tipos de Recursos',
            data: Object.values(tiposRecursoData),
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2,
            hoverOffset: 16
          }]
        },
        options: {
          responsive: true,
          cutout: '70%',
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1400,
            easing: 'easeInOutCubic'
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: { color: '#0c934a', font: { weight: 'bold' } }
            },
            tooltip: {
              backgroundColor: '#3498db',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#fff',
              borderWidth: 1
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
.dashboard-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fffc 0%, #e0f7fa 100%);
}
.kpi-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border-radius: 1.2rem;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 4px 24px rgba(12, 147, 74, 0.08);
  transition: transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s;
  cursor: pointer;
  &:hover {
    transform: scale(1.04) translateY(-4px);
    box-shadow: 0 8px 32px rgba(12, 147, 74, 0.18);
  }
}
.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.7rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.kpi-value {
  font-size: 2.1rem;
  font-weight: 700;
  color: #0c934a;
}
.kpi-label {
  font-size: 1.1rem;
  color: #888;
  font-weight: 500;
}
.chart-card {
  border-radius: 1.2rem;
  border: none;
  box-shadow: 0 4px 24px rgba(54, 162, 235, 0.08);
  transition: box-shadow 0.3s, transform 0.3s;
  &:hover {
    box-shadow: 0 8px 32px rgba(54, 162, 235, 0.18);
    transform: scale(1.01) translateY(-2px);
  }
}
.card-header {
  background: transparent;
  border-bottom: none;
}
h5 {
  font-weight: 700;
  letter-spacing: 0.5px;
}
</style>
