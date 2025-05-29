<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" class="text-center">
        <v-row align="center" justify="center">
        <v-img
          src="../../../../public/imagenes/undraw_access-denied_krem.svg"
          alt="Error 403"
          class="mb-4"
          max-width="300"
        ></v-img>
        </v-row>
        <h1 class="display-2 font-weight-bold mb-4">Error 403</h1>
        <h2 class="headline">Acceso Denegado</h2>
        <p class="subtitle-1 mt-3">
          Lo sentimos, no tienes permisos para acceder a esta página o función.
        </p>
        <v-btn
          color="primary"
          large
          @click="redirectToLogin"
          class="mt-5"
        >
          Volver al Inicio
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  methods: {
    redirectToLogin() {
      this.$router.push('/dashboard');
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>