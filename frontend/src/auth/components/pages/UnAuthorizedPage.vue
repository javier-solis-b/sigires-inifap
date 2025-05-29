<template>
  <div>
    <h1>Error 403</h1>
    <v-btn color="primary" @click="redirectToLogin">Necesitas iniciar sesión</v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    redirectToLogin() {
      this.$router.push('/login'); // Asume que '/login' es la ruta de tu página de inicio de sesión
    },
  },
};
</script>
