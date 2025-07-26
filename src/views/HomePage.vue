<template>
  <div class="home-container">
    <div class="welcome-card">
      <h1>Bienvenido!!!</h1>
      <p>Gestiona tus propiedades, agentes y clientes.</p>
      <Button label="Explorar propiedades" icon="pi pi-search" class="p-button-raised p-button-primary" @click="goToProperties" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    goToProperties() {
      this.$router.push('/properties');
    }
  }
};
</script>
<style scoped lang="scss">
.home-container {
    text-align: center;
}
</style>
