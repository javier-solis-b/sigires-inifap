<template>
  <v-form @submit.prevent="onSubmit">
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
    <div>
      <v-btn icon @click="$router.push('/usuarios')">
        <span class="material-symbols-outlined"> arrow_back </span>
      </v-btn>
      <v-col class="encabezado" style="margin: -10px" cols="12">
        <h3 class="fw-bold mb-3">Editar usuario</h3>
      </v-col>
    </div>

    <v-card>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="user.name"
              type="text"
              label="Usuario"
              variant="underlined"
               prepend-icon="mdi-account" 
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-switch
              v-model="user.isAdmin"
              :label="` ${
                user.isAdmin ? 'Administrador' : 'No es Administrador'
              } `"
              off-value="false"
              on-value="true"
              color="green"
            ></v-switch>
          </v-col>
          <v-col cols="12">
            <v-btn type="submit" color="primary">Actualizar</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-form>
</template>

<script>
import backend from "@/backend.js";

export default {
  data() {
    return {
      user: {
        name: "",
        isAdmin: false, // Inicializa isAdmin como false
      },
    };
  },
  async mounted() {
    const userId = this.$route.params.id;
    const userData = (await backend.get(`usuarios/${userId}`)).data;
    // Convertir el valor de isAdmin a booleano
    this.user = {
      ...userData,
      isAdmin: userData.isAdmin === 1, // Asumiendo que 1 indica administrador
    };
  },
  methods: {
    async onSubmit() {
      try {
        const response = await backend.patch(
          `usuarios/${this.$route.params.id}`,
          
          {
            name: this.user.name,
            isAdmin: this.user.isAdmin ? 1 : 0, // Convierte el valor booleano a entero
          }
        );
        console.log(response);
        this.$router.push({ name: 'usuarios' });
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    },
  },
};
</script>

<style scoped>
.material-symbols-outlined {
  cursor: pointer;
}
</style>
