<template>
  <div class="content property-list">
    <h2>Propiedades</h2>

    <div class="card">
      <DataTable :value="properties" stripedRows>
        <template #header>
          <div class="header-table">
            <IconField>
              <InputIcon>
                <i class="pi pi-search" />
              </InputIcon>
              <InputText placeholder="Realizar búsqueda (Nombre, Dirección, Precio)" v-model="searchProperty" />
            </IconField>
            <Button icon="pi pi-plus" label="Agregar Nueva Propiedad" @click="openCreateModal" />
          </div>
          <Fieldset legend="Filtros" :toggleable="true">
            <div style="display: flex; flex-direction: row; gap: 1rem; flex-wrap: wrap; justify-content: space-between; padding: 10px;">
              <div style="display: flex; flex-direction: column">
                <label>Tipo de Propiedad</label>
                <Select :options="propertyTypes" optionLabel="name" placeholder="Seleccionar un tipo"
                  v-model="propertyTypeFilter" />
              </div>
              <div style="display: flex; flex-direction: column">
                <label>Agente</label>
                <Select :options="agents" optionLabel="name" placeholder="Seleccionar un agente"
                  v-model="agentFilter" />
              </div>
              <div style="display: flex; flex-direction: column">
                <label>Cliente</label>
                <Select :options="clients" optionLabel="name" placeholder="Seleccionar un cliente"
                  v-model="clientFilter" />
              </div>
              <div style="display: flex; flex-direction: column">
                <label>Estado</label>
                <Select :options="['disponible', 'vendido']" placeholder="Seleccionar estado"
                  v-model="statusFilter" />
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 1rem; padding-top: 10px;">
              <Button label="Limpiar Filtros" outlined @click="clearFilters" />
            </div>
          </Fieldset>
        </template>

        <Column field="id" header="ID"></Column>
        <Column field="type.name" header="Tipo"></Column>
        <Column field="name" header="Nombre"></Column>
        <Column field="address" header="Dirección"></Column>
        <Column field="price" header="Precio"></Column>
        <Column field="agent.name" header="Agente"></Column>
        <Column field="description" header="Descripción"></Column>
        <Column field="client.name" header="Cliente"></Column>
        <Column field="status" header="Estado">
          <template #body="{ data }">
            <Tag :value="data.status" :severity="getSeverity(data.status)" />
          </template>
        </Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded severity="info" style="margin-right: 10px;"
              @click="editProperty(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger"
              @click="confirmDeleteProperty(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <Dialog v-model:visible="visible" modal :header="mode === 'edit' ? 'Editar Propiedad' : 'Nueva Propiedad'"
    :style="{ width: '25rem' }">
    <AddEditFormProperty @cancel="visible = false" @created="addNew" @update="updateProperty"
      :propertyModel="currentProperty" />
  </Dialog>

  <Dialog v-model:visible="confirmDeletevisible" modal header="Confirmar Eliminación" :style="{ width: '25rem' }">
    <p>¿Estás seguro de que deseas eliminar esta propiedad?</p>
    <template #footer>
      <Button label="Cancelar" outlined @click="confirmDeletevisible = false" />
      <Button label="Eliminar" @click="deleteProperty(currentProperty)" />
    </template>
  </Dialog>
</template>

<script>
import { config } from '../config/config';
import AddEditFormProperty from '../components/AddEditFormProperty.vue';

export default {
  name: 'PropertyList',
  components: { AddEditFormProperty },
  data() {
    return {
      confirmDeletevisible: false,
      visible: false,
      mode: 'create',
      properties: [],
      clients: [],
      agents: [],
      propertyTypes: [],
      currentProperty: null,
      searchProperty: '',
      agentFilter: '',
      clientFilter: '',
      statusFilter: '',
      propertyTypeFilter: ''
    };
  },
  mounted() {
    this.getClients();
    this.getAgents();
    this.getPropertyTypes();
    this.getProperties();
  },
  watch: {
    searchProperty: 'getProperties',
    agentFilter: 'getProperties',
    clientFilter: 'getProperties',
    statusFilter: 'getProperties',
    propertyTypeFilter: 'getProperties'
  },
  methods: {
    clearFilters() {
      this.searchProperty = '';
      this.propertyTypeFilter = '';
      this.agentFilter = '';
      this.clientFilter = '';
      this.statusFilter = '';
    },
    getPropertyTypes() {
      this.axios.get(`${config.apiUrl}/types`)
        .then(res => this.propertyTypes = res.data)
        .catch(err => console.error('Error cargando tipos:', err));
    },
    getClients() {
      this.axios.get(`${config.apiUrl}/clients`)
        .then(res => this.clients = res.data)
        .catch(err => console.error('Error cargando clientes:', err));
    },
    getAgents() {
      this.axios.get(`${config.apiUrl}/agents`)
        .then(res => this.agents = res.data)
        .catch(err => console.error('Error cargando agentes:', err));
    },
    getProperties() {
      const params = {
        _expand: ['agent', 'type', 'client']
      };

      if (this.searchProperty) {
        params.q = this.searchProperty;
      }
      if (this.propertyTypeFilter?.id) {
        params.typeId = this.propertyTypeFilter.id;
      }
      if (this.agentFilter?.id) {
        params.agentId = this.agentFilter.id;
      }
      if (this.clientFilter?.id) {
        params.clientId = this.clientFilter.id;
      }
      if (this.statusFilter) {
        params.status = this.statusFilter;
      }

      this.axios.get(`${config.apiUrl}/properties`, { params })
        .then(res => this.properties = res.data)
        .catch(err => console.error('Error cargando propiedades:', err));
    },
    openCreateModal() {
      this.mode = 'create';
      this.currentProperty = {
        typesProperty: null,
        name: '',
        address: '',
        price: null,
        description: '',
        agent: null,
        client: null
      };
      this.visible = true;
    },
    getSeverity(status) {
      switch (status) {
        case 'vendido': return 'danger';
        case 'disponible': return 'success';
        default: return null;
      }
    },
    saveProperty(property) {
      const url = property.id
        ? `${config.apiUrl}/properties/${property.id}`
        : `${config.apiUrl}/properties`;
      const method = property.id ? 'put' : 'post';
      property.status = property.status || 'disponible';

      this.axios[method](url, property)
        .then(() => {
          this.getProperties();
          this.visible = false;
        })
        .catch(err => console.error("Error guardando propiedad:", err));
    },
    addNew(newItem) {
      this.visible = false;
      this.saveProperty(newItem);
    },
    editProperty(property) {
      this.mode = 'edit';
      this.currentProperty = { ...property, typesProperty: property.type };
      this.visible = true;
    },
    updateProperty(updatedItem) {
      this.saveProperty(updatedItem);
    },
    confirmDeleteProperty(property) {
      this.currentProperty = property;
      this.confirmDeletevisible = true;
    },
    deleteProperty(property) {
      this.axios.delete(`${config.apiUrl}/properties/${property.id}`)
        .then(() => {
          this.getProperties();
          this.confirmDeletevisible = false;
        })
        .catch(err => console.error("Error eliminando propiedad:", err));
    }
  }
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
</style>
