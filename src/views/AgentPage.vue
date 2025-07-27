<template>
  <div class="content property-list">
    <h2>Agentes</h2>

    <div class="card">
      <DataTable :value="agentsList" stripedRows>
        <template #header>
          <div class="header-table">
            <Button icon="pi pi-plus" label="Agregar Nuevo Agente" @click="openCreateModal" />
          </div>
        </template>
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Nombre"></Column>
        <Column field="phone" header="Teléfono"></Column>
        <Column field="email" header="Email"></Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded severity="info" style="margin-right: 10px;"
              @click="editAgent(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteAgent(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <Dialog v-model:visible="visible" modal :header="mode === 'edit' ? 'Editar Agente' : 'Nuevo Agente'"
    :style="{ width: '25rem' }">
    <AddEditFormAgentClient @cancel="visible = false" @created="addNew" @update="updateAgent" :typeModel="currentAgent" :isClient="false" />
  </Dialog>
  <Dialog v-model:visible="confirmDeletevisible" modal header="Confirmar Eliminación" :style="{ width: '25rem' }">
    <p>¿Estás seguro de que deseas eliminar este agente?</p>
    <template #footer>
      <Button label="Cancelar" outlined @click="confirmDeletevisible = false" />
      <Button label="Eliminar" @click="deleteAgent(currentAgent)" />
    </template>
  </Dialog>
</template>

<script>
import { config } from '../config/config';
import AddEditFormAgentClient from '@/components/AddEditFormAgentClient.vue';

export default {
  name: 'AgentList',
  components: {
    AddEditFormAgentClient
  },
  data() {
    return {
      confirmDeletevisible: false,
      visible: false,
      mode: 'create',
      currentAgent: null,
      agentsList: []
    };
  },
  mounted() {
    this.getAgents();
  },
  methods: {
    getAgents() {
      this.axios
        .get(`${config.apiUrl}/agents`)
        .then((res) => (this.agentsList = res.data))
        .catch((err) => console.error('Error cargando agentes:', err));
    },
    openCreateModal() {
      this.mode = 'create';
      this.currentAgent = {
        name: null,
        phone: null,
        email: null,
      };
      this.visible = true;
    },
    saveAgent(agent) {
      const url = agent.id ? `${config.apiUrl}/agents/${agent.id}` : `${config.apiUrl}/agents`;
      const method = agent.id ? 'put' : 'post';
      this.axios[method](url, agent)
        .then(() => {
          this.getAgents();
          this.visible = false;
        })
        .catch(error => {
          console.error("Error saving agent:", error);
        });
    },
    addNew(newItem) {
      this.visible = false;
      this.saveAgent(newItem);
    },
    closeModal() {
      this.visible = false;
    },
    editAgent(agent) {
      this.mode = 'edit';
      console.log('Editing agent:', agent);
      this.currentAgent = { ...agent };
      this.visible = true;
    },
    updateAgent(updatedItem) {
      this.saveAgent(updatedItem);
    },
    confirmDeleteAgent(agent) {
      this.currentAgent = agent;
      this.confirmDeletevisible = true;
    },
    deleteAgent(agent) {
      console.log('Deleting agent:', agent);
      this.axios.delete(`${config.apiUrl}/agents/${agent.id}`)
        .then(() => {
          this.getAgents();
          this.confirmDeletevisible = false;
        })
        .catch(error => {
          console.error("Error deleting agent:", error);
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
