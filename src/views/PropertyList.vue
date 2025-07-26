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
              <InputText placeholder="Realizar busqueda" />
            </IconField>
            <Button icon="pi pi-plus" label="Agregar Nueva Propiedad" @click="visible = true" />
          </div>
        </template>
        <Column field="id" header="ID"></Column>
        <Column field="type.name" header="Tipo"></Column>
        <Column field="name" header="Nombre"></Column>
        <Column field="address" header="Direccion"></Column>
        <Column field="price" header="Precio"></Column>
        <Column field="agent.name" header="Agente"></Column>
        <Column field="description" header="Descripcion"></Column>
        <Column field="client.name" header="Cliente"></Column>
        <Column field="status" header="Estado">
          <template #body="{ data }">
            <Tag :value="data.status" :severity="getSeverity(data.status)" />
          </template>
        </Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded severity="info" style="margin-right: 10px;" @click="editProperty(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger"
              @click="confirmDeleteProperty(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
  </Dialog>
</template>

<script>
import { config } from '../config/config';

export default {
  name: 'PropertyList',
  data() {
    return {
      visible: false,
      properties: []
    };
  },
  mounted() {
    this.getProperties();
  },
  methods: {
    getProperties() {
      this.axios.get(`${config.apiUrl}/properties?_expand=agent&_expand=type&_expand=client`)
        .then(response => {
          this.properties = response.data;
        })
        .catch(error => {
          console.error("Error fetching properties:", error);
        });
    },
    getSeverity(status) {
      switch (status) {
        case 'vendido':
          return 'danger';

        case 'disponible':
          return 'success';

        default:
          return null;
      }
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
</style>
