import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Nora from "@primeuix/themes/aura";
import "primeicons/primeicons.css";

import axios from "axios";
import VueAxios from "vue-axios";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import Menubar from "primevue/menubar";
import Button from "primevue/button";
import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import iconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Dialog from 'primevue/dialog';

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: Nora,
      options: {
        darkModeSelector: false || "none",
      },
    },
  })
  .use(store)
  .use(router)
  .use(VueAxios, axios)
  .component("Menubar", Menubar)
  .component("Button", Button)
  .component("Card", Card)
  .component("DataTable", DataTable)
  .component("Column", Column)
  .component("Tag", Tag)
  .component("InputText", InputText)
  .component("IconField", iconField)
  .component("InputIcon", InputIcon)
  .component("Dialog", Dialog)  
  .mount("#app");
