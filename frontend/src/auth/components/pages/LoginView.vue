<template>
  <body class="container-fluid">
    <div v-if="showBanner" class="fixed-top welcome-banner alert alert-primary d-flex align-items-center justify-content-center flex-column responsive-banner">
      <button @click="showBanner = false" class="btn-close-banner" aria-label="Cerrar" title="Ocultar aviso">&times;</button>
      <h2 class="banner-title">¡Bienvenido a SIGIRES INIFAP (Versión de Pruebas)!</h2>
      <p class="banner-desc">
        Esta no es la versión original del sistema, sino una versión de pruebas. Por motivos de seguridad y demostración, aquí solo puedes editar parámetros para realizar pruebas, pero <b>no podrás crear ni eliminar registros</b>. Algunas funciones avanzadas de la versión oficial no están disponibles en este entorno.
      </p>
      <p class="banner-access">
        <b>Acceso de prueba:</b> <span style="color: #0c934a;">usuario</span> <b>user</b> &nbsp;|&nbsp; <span style="color: #0c934a;">contraseña</span> <b>user</b>
      </p>
      <p class="banner-footer">
        Si tienes dudas o necesitas acceso a la versión completa, contacta al administrador del sistema.<br>
        ¡Gracias por probar SIGIRES INIFAP!
      </p>
    </div>
    <div class="banner-spacer" v-if="showBanner"></div>
    <button v-if="!showBanner" class="show-banner-btn" @click="showBanner = true" title="Mostrar aviso de bienvenida">
      Mostrar aviso
    </button>

    <main class="row">
      <section class="col-md-6" id="panel-left">
        <div class="col-12 logo-container d-flex flex-column justify-content-center align-items-center">
          <h1 class="w-bold text-center">SIGIRES INIFAP</h1>
          <p class="col-12 text-center description mb-3">
            Bienvenido, al sistema de gestión <br />
            de inventarios de reactivos y soluciones.
          </p>
          <img src="/imagenes/entrada.jpg" alt="" style="width: 500px; height: auto; border-radius: 4px; background-color: rgba(255, 255, 255, 0.7);" />
        </div>
      </section>

      <section class="col-md-6" id="panel-right">
        <div class="container justify-content-center align-items-center col-12">
          <div class="col-12 text-center justify-content-center aling-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" fill="#0c934a" class="bi bi-door-open" viewBox="0 0 16 16">
            <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
            <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117M11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5M4 1.934V15h6V1.077z"/>
          </svg>
          </div>
          <div class="row mb-5">
            <h2 class="col-12 text-center">Iniciar sesión</h2>
          </div>
          <div class="row">
            <form @submit.prevent="handleFormSubmit" class="col-12 col-md-8 offset-md-2">
              <div class="form-group">
                <input v-model="name" class="form-control" name="email" id="email" placeholder="Usuario" required />
              </div>
              <br />
              <div class="form-group">
                <input v-model="password" type="password" class="form-control" name="password" id="password" placeholder="Contraseña" required />
              </div>
              <div class="form-group text-center pt-4">
                <input v-btn v-on:click="onLogin()" type="submit" class="btn btn-primary" value="Ingresar" />
              </div>
            </form>
          </div>
          <div class="row mt-5">
            <div v-if="errorMessage" class="error-message-container">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</template>

<script>
import { AuthService } from "@/auth/Services/AuthService";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      name: "",
      password: "",
      errorMessage: "",
      showBanner: true
    };
  },
  setup() {
    const router = useRouter(); // Utiliza la función useRouter de Vue Router
    return { router }; // Hace que router esté disponible en la plantilla
  },
  methods: {
    handleFormSubmit(event) {
      event.preventDefault();
      this.onLogin();
    },
    async onLogin() {
      try {
        const response = await AuthService.login(this.name, this.password);
        if (response.token) {
          this.router.push({ name: "dashboard" });
        } else {
          throw new Error("Credenciales incorrectas");
        }
      } catch (error) {
        this.errorMessage =
          "Error, ingresaste el usuario o contraseña incorrecta, por favor ingresa datos válidos";
      }
    },
  },
};
</script>

<style scoped>
.logo-container {
  background-color: transparent; 
  
}

.container {
  max-height: calc(
    100vh - 56px
  ); /* Ajusta según el tamaño de tu barra de navegación */
  margin: auto; /* Centra horizontalmente */
  padding: 0; /* Elimina padding */
}

.row {
  height: 100%; /* Asegura que la fila ocupe todo el espacio vertical */
}

.col {
  height: 100%; /* Asegura que la columna ocupe todo el espacio vertical */
}

.card {
  height: 100%; /* Asegura que la tarjeta ocupe todo el espacio vertical */
}
.error-message-container {
  background-color: red;
  color: white;
  padding: 10px;
  margin-top: 10px;
  text-align: center;
}

.text1 {
  text-align: center;
  padding: 15px;
}

.my-button {
  padding: 10px 160px;
  background-color: #018a4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.my-button:hover {
  background-color: #45a049;
}

.my-button:active {
  background-color: #3e8e41;
}
@media (max-width: 768px) {
  .form-label {
    font-size: 14px;
  }

  .my-button {
    padding: 8px 120px;
  }
}

.fw-normal {
  font: 150% sans-serif;
}
* {
  font-family: "Red Hat Display", sans-serif;
}
html,
body,
main {
  height: 100%;
}
#panel-left {
  display: flex !important;
  align-items: center;
  background-color: #0c934a;
}
#panel-right {
  display: flex !important;
  align-items: center;
  background-color: #f1f6f9;
}

h1 {
  color: #ffd700;
  font-size: 60px;
  font-weight: 900;
}
h2 {
  color: #0c934a;
  font-size: 40px;
  font-weight: 700;
}

.description {
  color: #ffff;
  font-size: 24px;
  font-weight: 400;
}

#panel-left .logo-container svg {
  width: 220px;
}

#panel-right form input {
  background-color: unset;
  border: 0;
  border-bottom: 2px solid #0c934a;
  border-radius: 0;
  font-weight: 400;
}

.btn.btn-primary {
  width: 430px; 
  border: 0 !important;
  border-radius: 50px !important;
  background-color: #0c934a !important;
  padding: 15px 40px !important;
  color: #fff !important;
  font-weight: 400 !important;
}

.responsive-banner {
  z-index: 1050;
  border-radius: 0 0 18px 18px;
  background: linear-gradient(90deg, #e0ffe6 0%, #f1f6f9 100%);
  border-bottom: 2px solid #0c934a;
  box-shadow: 0 2px 12px rgba(12,147,74,0.12);
  padding: 22px 18px;
  min-height: 170px;
  width: 100vw;
  max-width: 100vw;
}
.banner-title {
  color: #0c934a;
  font-weight: 800;
  margin-bottom: 10px;
  font-size: 2.1rem;
  text-align: center;
}
.banner-desc {
  font-size: 1.08rem;
  color: #333;
  max-width: 700px;
  margin-bottom: 10px;
  text-align: center;
}
.banner-access {
  font-size: 1rem;
  color: #0c934a;
  margin-bottom: 0;
  text-align: center;
}
.banner-footer {
  font-size: 0.95rem;
  color: #555;
  margin-top: 8px;
  text-align: center;
}
.banner-spacer {
  height: 185px;
}
@media (max-width: 900px) {
  .responsive-banner {
    padding: 16px 6vw;
    min-height: 180px;
  }
  .banner-title {
    font-size: 1.3rem;
  }
  .banner-desc {
    font-size: 0.98rem;
    max-width: 98vw;
  }
  .banner-access {
    font-size: 0.95rem;
  }
  .banner-footer {
    font-size: 0.85rem;
  }
  .banner-spacer {
    height: 200px;
  }
}
@media (max-width: 600px) {
  .responsive-banner {
    padding: 10px 2vw;
    min-height: 210px;
  }
  .banner-title {
    font-size: 1.1rem;
  }
  .banner-desc {
    font-size: 0.92rem;
    max-width: 99vw;
  }
  .banner-access {
    font-size: 0.9rem;
  }
  .banner-footer {
    font-size: 0.8rem;
  }
  .banner-spacer {
    height: 220px;
  }
}
@media only screen and (max-width: 767px) {
  #panel-left {
    display: none !important;
  }
}
.btn-close-banner {
  position: absolute;
  top: 10px;
  right: 18px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #0c934a;
  cursor: pointer;
  z-index: 1100;
  line-height: 1;
  padding: 0 8px;
  transition: color 0.2s;
}
.btn-close-banner:hover {
  color: #d33;
}
.show-banner-btn {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: #0c934a;
  color: #fff;
  border: none;
  border-radius: 18px;
  padding: 6px 18px;
  font-size: 1rem;
  z-index: 1100;
  box-shadow: 0 2px 8px rgba(12,147,74,0.08);
  cursor: pointer;
  transition: background 0.2s;
}
.show-banner-btn:hover {
  background: #22c55e;
}
</style>
