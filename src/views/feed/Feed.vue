<template>
        <div class="content-section introduction">
            <div class="feature-intro">
                <h1>Feed</h1>
            </div>
        </div>

        <div class='content-section'>
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                </template>

                <template #end>
                </template>
            </Toolbar>
        </div>

        <div class="content-section implementation">
            <div class="card grid grid-nogutter" style="justify-content: space-evenly; gap: 10px 0;">
                <Card v-for='(quote, index) in quotes' :key='index.id'  style="width: 25em">
                    <template #header>
                        <img alt="user header" src="demo/images/usercard.png" />
                    </template>
                    <template #title>{{ quote.title }}</template>
                    <template #subtitle>by <b>{{ quote.author }}</b></template>
                    <template #content>
                        <p>
                            {{ quote.description }}
                        </p>
                    </template>
                    <template #footer>
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editQuote(quote)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteQuote(quote)" />
                    </template>
                </Card>
            </div>
        </div>
    <Dialog v-model:visible="quoteDialog" :style="{ width: '450px' }" header="Quote Details" :modal="true" class="p-fluid">
        <div class="field">
            <label for="title">Title</label>
            <InputText id="title" v-model="quote.title" required="true" autofocus :class="{ 'p-invalid': submitted && !quote.title }" />
            <small v-if="submitted && !quote.title" class="p-error">Title is required.</small>
        </div>
        <div class="field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="quote.description" required="true" rows="3" cols="20" />
        </div>

        <div class="field">
            <label for="author.name" class="mb-3">Author Name</label>
            <Dropdown v-model="selectedAuthor"  required="true" :options="authorNames" optionLabel="name" placeholder="Author" />
        </div>

        <div class="field">
            <label class="mb-3">Genre</label>
            <MultiSelect v-model="selectedGenre" :options="genres" optionLabel="label" placeholder="Select Genres" display='chip'/>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveQuote" />
        </template>
    </Dialog>

    <Dialog v-model:visible="editQuoteDialog" :style="{ width: '450px' }" header="Quote Details" :modal="true" class="p-fluid">
        <div class="field">
            <label for="title">Title</label>
            <InputText id="title" v-model="quote.title" required="true" autofocus :class="{ 'p-invalid': submitted && !quote.title }" />
            <small v-if="submitted && !quote.title" class="p-error">Title is required.</small>
        </div>
        <div class="field">
            <label for="description">Description</label>
            <Textarea id="description" v-model="quote.description" required="true" rows="3" cols="20" />
        </div>

        <div class="field">
            <label for="author.name" class="mb-3">Author Name</label>
            <InputText v-model="quote.author" type="text" disabled />
        </div>

        <div class="field">
            <label class="mb-3">Genre</label>
            <MultiSelect v-model="quote.genre" :options="genres" optionLabel="label" placeholder="Select Genres" display='chip'/>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveQuote" />
        </template>
    </Dialog>

    <Dialog v-model:visible="deleteQuoteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="quote"
            >Are you sure you want to delete <b>{{ quote.title }}</b
            >?</span
            >
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteQuoteDialog = false" />
            <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteQuote(quote.id)" />
        </template>
    </Dialog>

</template>


<script>
import axios from 'axios';
import QuoteService from "../../service/QuoteService";
import InputText from '../../components/inputtext/InputText';

export default {
    data() {
        return {
            quotes: [],
            quote: {},
            selectedAuthor: null,
            selectedGenre: null,
            authorNames: [
                { name: "Elon Mask" },
                { name: "M. Jordan" },
                { name: "Hindi by from Tutorial" },
                { name: "The Unique Uz"}
            ],
            genres: [
                { label: "Motivational" },
                { label: "Technology" },
                { label: "Life Skills" },
                { label: "Language Skills"},
                { label: "Success"}
            ],
            title: '',
            description: '',
            createdAt: new Date(Date.now()).toLocaleString(),
            display: false,
            layout: 'grid',
            displayConfirmation: false,
            sortKey: null,
            sortOrder: null,
            sortField: null,
            quoteDialog: false,
            editQuoteDialog: false,
            deleteQuoteDialog: false,
            deleteQuotesDialog: false,
            selectedQuotes: null,
            submitted: false,
        };
    },
    quoteService: null,
    created() {
        this.quoteService = new QuoteService();
    },
    mounted() {
        this.quoteService.getQuotes().then((data) => (this.quotes = data));

        axios
            .get('http://localhost:3000/quotes')
            .then(response => (this.quotes = response.data));

    },
    methods: {
        openNew() {
            this.submitted = false;
            this.quoteDialog = true;
        },
        hideDialog() {
            this.quoteDialog = false;
            this.editQuoteDialog = false;
            this.submitted = false;
        },
        saveQuote() {
            this.submitted = true;

            let form = {
                title: this.quote.title,
                author: this.selectedAuthor.name,
                description: this.quote.description,
                genre: this.selectedGenre,
                createdAt: this.createdAt
            }

            if (this.quote.title) {
                this.quotes.push(form);
                axios
                    .post('http://localhost:3000/quotes', form)
                    .then(() => {
                        this.$toast.add({severity:'success', summary: 'Successful', detail: 'Quote Created', life: 3000});
                    })
            }

            this.quoteDialog = false;
            // this.editQuoteDialog = false;
            this.quote = {};
            },

        editQuote(quote) {
            this.quote = { ...quote };
            this.editQuoteDialog = true;
        },
        confirmDeleteQuote(quote) {
            this.quote = quote;
            this.deleteQuoteDialog = true;
        },
        deleteQuote(index) {
            axios
                .delete(`http://localhost:3000/quotes/${index}`)
                .then(response => {
                    console.log(response)
                    window.location.reload()
                })
                .catch(err=> (console.log(err)))
                this.quotes.splice(index, 1)
            this.quote = {};
            this.$toast.add({ severity: 'success', summary: 'Successful', detail: 'Quote Deleted', life: 3000 });
        }
    },
    components: { InputText },
};
</script>

<style lang="scss" scoped>
.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 960px) {
        align-items: start;
    }
}

.quote-image {
    width: 100px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .quote-image {
    width: 150px;
    margin: 0 auto 2rem auto;
    display: block;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
}

@media screen and (max-width: 960px) {
    ::v-deep(.p-toolbar) {
        flex-wrap: wrap;

        .p-button {
            margin-bottom: 0.25rem;
        }
    }
}
</style>
