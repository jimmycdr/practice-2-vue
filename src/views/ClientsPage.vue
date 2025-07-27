<template>
  <div class="content property-list">
    <h2>Clientes</h2>

    <div class="card">
      <DataTable :value="clientsList" stripedRows>
        <template #header>
          <div class="header-table">
            <Button icon="pi pi-plus" label="Agregar Nuevo Cliente" @click="openCreateModal" />
          </div>
        </template>
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Nombre"></Column>
        <Column field="phone" header="Teléfono"></Column>
        <Column field="email" header="Email"></Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded severity="info" style="margin-right: 10px;"
              @click="editClient(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteClient(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <Dialog v-model:visible="visible" modal :header="mode === 'edit' ? 'Editar Cliente' : 'Nuevo Cliente'"
    :style="{ width: '25rem' }">
    <AddEditFormAgentClient @cancel="visible = false" @created="addNew" @update="updateClient" :typeModel="currentClient" :isClient="true" />
  </Dialog>
  <Dialog v-model:visible="confirmDeletevisible" modal header="Confirmar Eliminación" :style="{ width: '25rem' }">
    <p>¿Estás seguro de que deseas eliminar este cliente?</p>
    <template #footer>
      <Button label="Cancelar" outlined @click="confirmDeletevisible = false" />
      <Button label="Eliminar" @click="deleteClient(currentClient)" />
    </template>
  </Dialog>
</template>

<script>
import { config } from '../config/config';
import AddEditFormAgentClient from '@/components/AddEditFormAgentClient.vue';

export default {
  name: 'ClientList',
  components: {
    AddEditFormAgentClient
  },
  data() {
    return {
      confirmDeletevisible: false,
      visible: false,
      mode: 'create',
      currentClient: null,
      clientsList: []
    };
  },
  mounted() {
    this.getClients();
  },
  methods: {
    getClients() {
      this.axios
        .get(`${config.apiUrl}/clients`)
        .then((res) => (this.clientsList = res.data))
        .catch((err) => console.error('Error cargando clientes:', err));
    },
    openCreateModal() {
      this.mode = 'create';
      this.currentClient = {
        name: null,
        phone: null,
        email: null,
      };
      this.visible = true;
    },
    saveClient(client) {
      const url = client.id ? `${config.apiUrl}/clients/${client.id}` : `${config.apiUrl}/clients`;
      const method = client.id ? 'put' : 'post';
      this.axios[method](url, client)
        .then(() => {
          this.getClients();
          this.visible = false;
        })
        .catch(error => {
          console.error("Error saving client:", error);
        });
    },
    addNew(newItem) {
      this.visible = false;
      this.saveClient(newItem);
    },
    closeModal() {
      this.visible = false;
    },
    editClient(client) {
      this.mode = 'edit';
      console.log('Editing client:', client);
      this.currentClient = { ...client };
      this.visible = true;
    },
    updateClient(updatedItem) {
      this.saveClient(updatedItem);
    },
    confirmDeleteClient(client) {
      this.currentClient = client;
      this.confirmDeletevisible = true;
    },
    deleteClient(client) {
      this.axios.delete(`${config.apiUrl}/clients/${client.id}`)
        .then(() => {
          this.getClients();
          this.confirmDeletevisible = false;
        })
        .catch(error => {
          console.error("Error deleting client:", error);
        });
    }
  },
};
</script>
<style scoped>
.property-list {
  margin-top: 20px;
  padding: 20px;
}

.card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.header-table {
  display: flex;
  direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
</style>
