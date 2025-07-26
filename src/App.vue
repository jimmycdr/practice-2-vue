<template>
  <div class="app-container">
    <Menubar :model="items" class="custom-menubar">
      <template #start>
        <span class="logo-text">🏡 <strong>Inmobiliaria App</strong></span>
      </template>

      <template #item="{ item, props }">
        <router-link v-if="item.to" :to="item.to" v-bind="props.action" class="flex align-items-center gap-2 px-3 py-2">
          <i :class="item.icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </template>

      <template #end>
        <Button label="Login" icon="pi pi-sign-in" class="p-button-outlined p-button-sm login-btn" />
      </template>
    </Menubar>

    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { label: 'Inicio', icon: 'pi pi-home', to: '/' },
        { label: 'Propiedades', icon: 'pi pi-building', to: '/properties' },
        { label: 'Agentes', icon: 'pi pi-id-card', to: '/agents' },
        { label: 'Clientes', icon: 'pi pi-users', to: '/clients' },
        { label: 'Configuracion', icon: 'pi pi-cog', to: '/settings' },
      ],
    };
  },
};
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
}
.custom-menubar {
  padding: 0.5rem 2rem;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.router-link-exact-active {
  color: #fff !important;
  background: #059669;
  border-radius: 5px;
}

.logo-text {
  font-size: 1.4rem;
}

.login-btn {
  margin-left: auto;
}

.content {
  h2 {
    color: #059669
  }
}
</style>
