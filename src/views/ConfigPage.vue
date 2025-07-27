<template>
  <div class="content property-list">
    <h2>Tipos de Propiedades</h2>

    <div class="card">
      <DataTable :value="typesList" stripedRows>
        <template #header>
          <div class="header-table">
            <Button icon="pi pi-plus" label="Agregar Nuevo Tipo" @click="openCreateModal" />
          </div>
        </template>
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Nombre"></Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded severity="info" style="margin-right: 10px;"
              @click="editType(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteType(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <Dialog v-model:visible="visible" modal :header="mode === 'edit' ? 'Editar Tipo' : 'Nuevo Tipo'"
    :style="{ width: '25rem' }">
    <AddEditFormTypes @cancel="visible = false" @created="addNew" @update="updateType" :typeModel="currentType" />
  </Dialog>
  <Dialog v-model:visible="confirmDeletevisible" modal header="Confirmar Eliminación" :style="{ width: '25rem' }">
    <p>¿Estás seguro de que deseas eliminar este tipo?</p>
    <template #footer>
      <Button label="Cancelar" outlined @click="confirmDeletevisible = false" />
      <Button label="Eliminar" @click="deleteType(currentType)" />
    </template>
  </Dialog>
</template>

<script>
import { config } from '../config/config';
import AddEditFormTypes from '../components/AddEditFormTypes.vue';

export default {
  name: 'PropertyList',
  components: {
    AddEditFormTypes
  },
  data() {
    return {
      confirmDeletevisible: false,
      visible: false,
      mode: 'create',
      currentType: null,
      typesList: []
    };
  },
  mounted() {
    this.getTypes();
  },
  methods: {
    getTypes() {
      this.axios
        .get(`${config.apiUrl}/types`)
        .then((res) => (this.typesList = res.data))
        .catch((err) => console.error('Error cargando tipos:', err));
    },
    openCreateModal() {
      this.mode = 'create';
      this.currentType = {
        name: null,
      };
      this.visible = true;
    },
    saveType(type) {
      const url = type.id ? `${config.apiUrl}/types/${type.id}` : `${config.apiUrl}/types`;
      const method = type.id ? 'put' : 'post';
      this.axios[method](url, type)
        .then(() => {
          this.getTypes();
          this.visible = false;
        })
        .catch(error => {
          console.error("Error saving type:", error);
        });
    },
    addNew(newItem) {
      this.visible = false;
      this.saveType(newItem);
    },
    closeModal() {
      this.visible = false;
    },
    editType(type) {
      this.mode = 'edit';
      this.currentType = { ...type };
      this.visible = true;
    },
    updateType(updatedItem) {
      this.saveType(updatedItem);
    },
    confirmDeleteType(type) {
      this.currentType = type;
      this.confirmDeletevisible = true;
    },
    deleteType(type) {
      this.axios.delete(`${config.apiUrl}/types/${type.id}`)
        .then(() => {
          this.getTypes();
          this.confirmDeletevisible = false;
        })
        .catch(error => {
          console.error("Error deleting type:", error);
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
