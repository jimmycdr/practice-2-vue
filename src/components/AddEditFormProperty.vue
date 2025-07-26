<template>
    <div class="container py-4">
        <h4 class="mb-4">{{ isEditMode ? 'Edit Contact' : 'New Contact' }}</h4>

        <form @submit.prevent="submitForm" novalidate>
            <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="formData.name" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="formData.email" type="email" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Address</label>
                <input v-model="formData.address" type="text" class="form-control" />
            </div>

            <div class="mb-3">
                <label class="form-label">Phone</label>
                <input v-model="formData.phone" type="text" class="form-control" />
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Country</label>
                    <input v-model="formData.country" type="text" class="form-control" />
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">City</label>
                    <input v-model="formData.city" type="text" class="form-control" />
                </div>
            </div>

            <div class="d-flex justify-content-between">
                <button type="submit" class="btn btn-success">
                    <i class="bi bi-save me-1"></i> {{ isEditMode ? 'Save Changes' : 'Create Contact' }}
                </button>
                <button type="button" class="btn btn-outline-secondary" @click="$emit('cancel')">
                    <i class="bi bi-x-circle me-1"></i> Cancel
                </button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'AddEditFormProperty',
    props: {
        contact: {
            type: Object,
            default: () => ({
                name: '',
                email: '',
                address: '',
                phone: '',
                country: '',
                city: ''
            })
        }
    },

    data() {
        return {
            formData: { ...this.contact }
        };
    },
    computed: {
        isEditMode() {
            return !!this.contact?.id;
        }
    },
    methods: {
        submitForm() {
            
            if (!this.formData.name || !this.formData.email) return
            const payload = {
                ...this.formData,
                id: this.contact?.id || null
            };
            this.formData = {
                name: '',
                email: '',
                address: '',
                phone: '',
                country: '',
                city: ''
            }
            this.$emit(this.isEditMode ? 'update' : 'created', payload);
        }
    }
};
</script>
