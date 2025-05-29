<template>
  <div class="users-view">
    <h3 class="fw-bold mb-0 text-color" style="color: #0c934a;">Usuarios</h3>
    <div>
     
      <v-col class="encabezado  " style="margin: -10px;" cols="12">
     <p v-if="!isAdmin" class="alert alert-info" style="font-size: 14px;">
      Para este usuario solo se permite la visualización de los usuarios
    </p>

      </v-col>
    </div>
    <v-row>
      <v-col cols="12" style="margin: -1px; padding:5px">
        <v-btn
          class="btn_add_user"
         v-if="isAdmin"
          @click="onCreateUser"
        >
          + Crear nuevo usuario</v-btn
        >
      </v-col>  
      <v-col
        v-for="user in paginatedUsers"
        :key="user.id"
        cols="10"
        sm="10"
        md="6"
        lg="6"
      
        
      >
        <UserDetails :user="user" />
      </v-col>
    </v-row>
    <paginate
      :page-count="pageCount"
      :click-handler="handlePageClick"
      :prev-text="'Anterior'"
      :next-text="'Siguiente'"
      :container-class="'pagination'"
    ></paginate>
  </div>
</template>

<script>
import UserDetails from "../../organisms/UserDetails.vue";
import { UserService } from "@/users/services/UserService.js";
import Paginate from "vuejs-paginate-next";

export default {
  data() {
    return {
      users: [],
      currentPage: 1,
      perPage: 10,
    };
  },

  async mounted() {
    try {
      this.users = await UserService.all();
    } catch (error) {
      console.error("Error loading users:", error);
    }
  },

  computed: {
    isAdmin() {
      // Consistente con el login y el middleware
      return localStorage.getItem('isAdmin') === 'true';
    },
    pageCount() {
      return Math.ceil(this.users.length / this.perPage);
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.users.slice(start, end);
    },
  },

  methods: {
    handlePageClick(pageNum) {
      this.currentPage = pageNum;
    },
    onCreateUser() {
      // Consistente con el login y el middleware
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      if (!isAdmin) {
        this.$router.push('/NoPermisos');
        return;
      }
      this.$router.push({ name: 'usuarios.create' });
    },
  },

  components: { UserDetails, Paginate },
};
</script>

<style lang="scss" scoped>

.btn_add_user {
  background-color: var(--primary);
  color: var(--light);
  float: right;

  padding: 5px ; /* Ajusta el padding para mejorar la apariencia */
  font-size: 14px; /* Ajusta el tamaño de fuente si es necesario */
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  cursor: pointer;
}

.users-view {
  

  .v-row {
    margin-right: -5px;
    margin-left: -10px;
    
  }

  .v-col {
    margin-bottom: 20px;
  }
}
</style>

