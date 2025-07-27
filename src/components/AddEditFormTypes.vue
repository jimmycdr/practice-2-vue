<template>
    <div class="flex justify-center">

        <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" :validateOnValueUpdate="false"
            :validateOnBlur="true" @submit="onFormSubmit"
            class="flex flex-col gap-4 w-full sm:w-96">

            <div class="form-field">
                <InputText name="name" placeholder="Nombre del Tipo" fluid />
                <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.name.error?.message }}
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
        typeModel: {
            type: Object,
            default: () => ({
                name: '',
            })
        }
    },
    data() {
        return {
            initialValues: {
                name: this.typeModel.name || '',
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

            if (!values.name) {
                errors.name = [{ message: 'Nombre requerido' }];
            }

            return { errors };
        },

        onFormSubmit({ valid, states }) {
            const values = {
                name: states.name.value,
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
