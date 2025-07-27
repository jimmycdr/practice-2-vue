<template>
    <div class="flex justify-center">

        <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" :validateOnValueUpdate="false"
            :validateOnBlur="true" @submit="onFormSubmit"
            class="flex flex-col gap-4 w-full sm:w-96">

            <div class="form-field">
                <Select name="typesProperty" :options="typesProperty" optionLabel="name"
                    placeholder="Seleccionar un tipo" fluid />
                <Message v-if="$form.typesProperty?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.typesProperty.error?.message }}
                </Message>
            </div>

            <div class="form-field">
                <InputText name="name" placeholder="Nombre de la Propiedad" fluid />
                <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.name.error?.message }}
                </Message>
            </div>

            <div class="form-field">
                <Textarea name="address" rows="3" style="resize: none" placeholder="Dirección" />
                <Message v-if="$form.address?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.address.error?.message }}
                </Message>
            </div>

            <div class="form-field">
                <InputText name="price" type="number" placeholder="Precio" fluid />
                <Message v-if="$form.price?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.price.error?.message }}
                </Message>
            </div>

            <div class="form-field">
                <Textarea name="description" rows="3" style="resize: none" placeholder="Descripción" />
                <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.description.error?.message }}
                </Message>
            </div>

            <div class="form-field">
                <Select name="agent" :options="agents" optionLabel="name" placeholder="Seleccionar un agente" fluid />
                <Message v-if="$form.agent?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.agent.error?.message }}
                </Message>
            </div>

            <div class="form-field">
                <Select name="client" :options="clients" optionLabel="name" placeholder="Seleccionar un cliente"
                    fluid />
                <Message v-if="$form.client?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.client.error?.message }}
                </Message>
            </div>

            <div class="flex footer-modal">
                <Button label="Cancelar" outlined @click="$emit('cancel')" />
                <Button type="submit" label="Guardar" />
            </div>
        </Form>
    </div>
</template>

<script>
import { Form, InputText, Select, Textarea, Button, Message } from 'primevue';
import { config } from '../config/config';

export default {
    name: 'AddEditFormProperty',
    components: {
        Message,
    },
    props: {
        propertyModel: {
            type: Object,
            default: () => ({
                typesProperty: null,
                name: '',
                address: '',
                price: '',
                description: '',
                agent: null,
                client: null
            })
        }
    },
    data() {
        return {
            typesProperty: [],
            clients: [],
            agents: [],
            initialValues: {
                typesProperty: this.propertyModel.typesProperty || null,
                name: this.propertyModel.name || '',
                address: this.propertyModel.address || '',
                price: this.propertyModel.price || '',
                description: this.propertyModel.description || '',
                agent: this.propertyModel.agent || null,
                client: this.propertyModel.client || null
            }
        };
    },
    computed: {
        isEditMode() {
            return !!this.propertyModel?.id;
        }
    },
    mounted() {
        this.getTypeProperty();
        this.getClients();
        this.getAgents();
    },
    methods: {
        resolver({ values }) {
            const errors = {};

            if (!values.typesProperty) {
                errors.typesProperty = [{ message: 'Tipo de propiedad requerido' }];
            }

            if (!values.name) {
                errors.name = [{ message: 'Nombre requerido' }];
            }

            if (!values.address) {
                errors.address = [{ message: 'Dirección requerida' }];
            }

            if (!values.price) {
                errors.price = [{ message: 'Precio requerido' }];
            } else if (isNaN(values.price)) {
                errors.price = [{ message: 'El precio debe ser numérico' }];
            }

            if (!values.description) {
                errors.description = [{ message: 'Descripción requerida' }];
            }

            if (!values.agent) {
                errors.agent = [{ message: 'Agente requerido' }];
            }

            if (!values.client) {
                errors.client = [{ message: 'Cliente requerido' }];
            }

            return { errors };
        },

        onFormSubmit({ valid, states }) {
            const values = {
                typesProperty: states.typesProperty.value,
                name: states.name.value,
                address: states.address.value,
                price: states.price.value,
                description: states.description.value,
                agent: states.agent.value,
                client: states.client.value
            };

            const payload = {
                ...values,
                id: this.propertyModel?.id || null,
                typeId: values.typesProperty?.id || null,
                agentId: values.agent?.id || null,
                clientId: values.client?.id || null
            };

            this.$emit(this.isEditMode ? 'update' : 'created', payload);
        },


        getTypeProperty() {
            this.axios
                .get(`${config.apiUrl}/types`)
                .then((res) => (this.typesProperty = res.data))
                .catch((err) => console.error('Error cargando tipos:', err));
        },

        getClients() {
            this.axios
                .get(`${config.apiUrl}/clients`)
                .then((res) => (this.clients = res.data))
                .catch((err) => console.error('Error cargando clientes:', err));
        },

        getAgents() {
            this.axios
                .get(`${config.apiUrl}/agents`)
                .then((res) => (this.agents = res.data))
                .catch((err) => console.error('Error cargando agentes:', err));
        }
    }
};
</script>

<style scoped>
.form-field {
    margin-bottom: 1rem;
}

.footer-modal {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
}
</style>
