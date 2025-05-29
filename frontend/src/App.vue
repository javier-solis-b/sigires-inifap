<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
    <footer v-if="$route.name !== 'login'" class="footer-app text-center">
      <span>© {{ year }} INIFAP. Derechos reservados. Desarrollado por Francisco Javier Solís Bamaca</span>
    </footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      year: new Date().getFullYear()
    };
  },
  components: {}
}
</script>

<style lang="scss">
:root {
  --primary: #0c934a;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: #f1f5f9;
  --light-alt: #f0f5e9;
}
.footer-app {
  width: 100%;
  background: #0c934a;
  color: #fff;
  padding: 10px 0 8px 0;
  font-size: 0.93rem;
  font-weight: 400;
  letter-spacing: 0.1px;
  font-family: 'Roboto', 'Arial', sans-serif;
  position: relative;
  left: 0;
  bottom: 0;
  z-index: 10;
  border-top: 1px solid #22c55e;
  box-shadow: 0 -1px 4px rgba(0,0,0,0.04);
  margin-top: 32px;
  text-align: center;
  border-radius: 0 0 8px 8px;
}
.footer-app span {
  display: inline-block;
  opacity: 0.92;
  letter-spacing: 0.5px;
}
@media (max-width: 600px) {
  .footer-app {
    font-size: 0.8rem;
    padding: 7px 0 6px 0;
    border-radius: 0 0 6px 6px;
  }
}
</style>
