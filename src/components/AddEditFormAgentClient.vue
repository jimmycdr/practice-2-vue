<template>
    <div class="flex justify-center">

        <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" :validateOnValueUpdate="false"
            :validateOnBlur="true" @submit="onFormSubmit"
            class="flex flex-col gap-4 w-full sm:w-96">

            <div class="form-field">
                <InputText name="name" :placeholder="isClient ? 'Nombre del Cliente' : 'Nombre del Agente'" fluid />
                <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.name.error?.message }}
                </Message>
            </div>
            <div class="form-field">
                <InputText name="phone" :placeholder="isClient ? 'Telefono del Cliente' : 'Telefono del Agente'"
                    fluid />
                <Message v-if="$form.phone?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.phone.error?.message }}
                </Message>
            </div>
            <div class="form-field">
                <InputText name="email" :placeholder="isClient ? 'Email del Cliente' : 'Email del Agente'" fluid />
                <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.email.error?.message }}
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
import { Form, InputText, Button, Message } from 'primevue';

export default {
    name: 'AddEditFormTypes',
    components: {
        Message,
    },
    props: {
        isClient: {
            type: Boolean,
            default: false
        },
        typeModel: {
            type: Object,
            default: () => ({
                name: '',
            })
        }
    },
    data() {
        return {
            isClient: this.isClient,
            initialValues: {
                name: this.typeModel.name || '',
                phone: this.typeModel.phone || '',
                email: this.typeModel.email || '',
            }
        };
    },
    computed: {
        isEditMode() {
            return !!this.typeModel?.id;
        }
    },
    mounted() { },
    methods: {
        resolver({ values }) {
            const errors = {};
            if (!values.phone) {
                errors.phone = [{ message: 'Telefono requerido' }];
            } else if (!/^\d+$/.test(values.phone)) {
                errors.phone = [{ message: 'Telefono debe ser numerico' }];
            }
            if (!values.name) {
                errors.name = [{ message: 'Nombre requerido' }];
            }
            if (this.isClient && !values.email) {
                errors.email = [{ message: 'Email requerido' }];
            } else if (this.isClient && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = [{ message: 'Email debe ser valido' }];
            }

            return { errors };
        },

        onFormSubmit({ valid, states }) {
            const values = {
                name: states.name.value,
                phone: states.phone.value,
                email: states.email.value,
            };

            const payload = {
                ...values,
                id: this.typeModel?.id || null,
            };

            this.$emit(this.isEditMode ? 'update' : 'created', payload);
        },
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
