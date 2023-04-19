let eventBus = new Vue()

Vue.component('kanban-board', {
    template: `
    <div class="kanban-board">
        <col1 :column1="column1"></col1>
        <col2 :column2="column2"></col2>
        <col3 :column3="column3"></col3>
        <col4 :column4="column4"></col4>
    </div>
`,
    data() {
        return {
            column1: { title: "To do", cards: [] },
            column2: { title: "In progress", cards: [] },
            column3: { title: "Testing", cards: [] },
            column4: { title: "Done", cards: [] },
        }
    },
    mounted() {
        this.column1 = JSON.parse(localStorage.getItem('column1')) || [];
        this.column2 = JSON.parse(localStorage.getItem('column2')) || [];
        eventBus.$on('addNewCard', card => {
            this.column1.cards.push(card);
            this.saveColumn1();
        });
        eventBus.$on('addToCol2', card => {
            this.column2.cards.push(card);
            this.column1.cards.splice(this.column1.cards.indexOf(card), 1);
            this.saveColumn1();
            this.saveColumn2()
        });
    },
    methods: {
        saveColumn1() {
            localStorage.setItem('column1', JSON.stringify(this.column1));
        },
        saveColumn2() {
            localStorage.setItem('column2', JSON.stringify(this.column2));
        },
    },
    // computed: {
    //     column2length() {
    //         return this.column2.length;
    //     }
    // }
})

Vue.component('new-card', {
    template: `
<section>
    <a href="#openModal" class="btn btnModal">Add task</a>
    <div id="openModal" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <a href="#close" title="Close" class="close">×</a>
            </div>
            <div class="modal-body"> 

            <form class="add-card" @submit.prevent="addNewCard">
            <h3>Add task</h3>
 
            <p>
                <label for="title">Title:</label>
                <input type="text" id="title" v-model="title">
            </p>
            <p>
                <label for="description">Description:</label>
                <textarea type="text" id="description" v-model="description"></textarea>
            </p>
            <p>
                <label for="deadline">Deadline:</label>
                <input type="date" id="deadline" v-model="deadline">
            </p>

            <button type="submit">Add</button>
            </form>
            </div>
            </div>
        </div>
    </div>
</section>

    `,
    props: {
      // column1: {
      //     type: Array
      // }
    },
    data() {
        return {
            title: '',
            description: '',
            createdDate: '',
            deadline: ''
        }
    },
    methods: {
        addNewCard() {
            if (this.title && this.description) {
                let card = {
                    title: this.title.trim(),
                    description: this.description.trim(),
                    deadline: this.deadline.trim(),
                    createdDate: new Date(),
                    editingDate: new Date(),
                    editable: false
                }
                eventBus.$emit('addNewCard', card);
                this.title = '';
                this.description = '';
                this.deadline = '';
                // this.createdDate = '';

            }
        }
    },
})

Vue.component('col1', {
    props: {
        column1: {
            type: Object,
        },
    },
    computed: {
        cards() {
            return this.column1.cards;
        },
    },
    methods: {
        getFormattedDeadlineDate(date){
            let myDate = new Date(date);
            return myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear();
        },
        getFormattedCreatedDate(date){
            let myDate = new Date(date);
            console.log(myDate);
            return myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear();
        },
        changeStatus(card) {
            card.editable = true
            card.editingDate = new Date();
            console.log(card.createdDate);
            eventBus.$emit('addToCol2', card);
            }
    },
    template: `
   <div class="to-do-col">
    <h3>{{column1.title}}</h3>
    <div class="card" v-for="(card, index) in cards" :key="index">
      <h3>{{card.title}}</h3>
      <p class="card-desc">{{card.description}}</p>
      <span class="card-deadline">deadline: {{ getFormattedDeadlineDate(card.deadline) }}</span>
      <p class="card-created-date">creating: {{ getFormattedCreatedDate(card.createdDate) }}</p>
      <button type="button" @click="changeStatus(card)">AA</button>
    </div>
  </div>
    `
})

Vue.component('col2', {
    props: {
        column2: {
            type: Object,
        },
    },
    computed: {
        cards() {
            return this.column2.cards;
        },
    },
    methods: {
        getFormattedDeadlineDate(date){
            let myDate = new Date(date);
            return myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear();
        },
        getFormattedCreatedDate(date){
            let myDate = new Date(date);
            console.log(myDate);
            return myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear();
        },
        // changeStatus(card) {
        //     card.editable = true
        //     eventBus.$emit('addToCol2', card);
        // }
    },
    template: `
   <div class="in-progress-col">
   <h3>{{ column2.title }}</h3>
   <div class="card" v-for="(card, index) in cards" :key="index">
      <h3>{{card.title}}</h3>
      <p class="card-desc">{{card.description}}</p>
      <span class="card-deadline">deadline: {{ getFormattedDeadlineDate(card.deadline) }}</span>
      <p class="card-created-date">created: {{ getFormattedCreatedDate(card.createdDate) }}</p>
      <p class="card-created-date">editing: {{ getFormattedCreatedDate(card.createdDate) }}</p> <!-- поменяй когда сделаешь редактирование карточки -->
<!--      <button type="button" @click="changeStatus(card)">AA</button>-->
    </div>
  </div>


   </div>
    `,
})

Vue.component('col3', {
    props: {
        column3: {
            type: Object,
        },
    },

    template: `
   <div class="testing-col">
   <h3>{{ column3.title }}</h3>
<!--        <ul class="note" v-for="note in column3" :key="note.date">-->
<!--            <li>{{note.title}}  -->
<!--            <ol>-->
<!--                <li class="items" v-for="item in note.noteItems" :key="item.title">-->
<!--                    {{item.title}}-->
<!--                </li>-->
<!--                    <span class="dateNote">{{note.date}}</span>-->
<!--            </ol>-->
<!--            </li>-->
<!--        </ul>-->
<!--        -->

   </div>
    `,
})

Vue.component('col4', {
    props: {
        column4: {
            type: Object,
        },
        // note: {
        //     type: Object
        // },
        // errors: {
        //     type: Array
        // }
    },
    template: `
   <div class="done-col">
   <h3>{{ column4.title }}</h3>
<!--        <ul class="note" v-for="note in column3" :key="note.date">-->
<!--            <li>{{note.title}}  -->
<!--            <ol>-->
<!--                <li class="items" v-for="item in note.noteItems" :key="item.title">-->
<!--                    {{item.title}}-->
<!--                </li>-->
<!--                    <span class="dateNote">{{note.date}}</span>-->
<!--            </ol>-->
<!--            </li>-->
<!--        </ul>-->


   </div>
    `,
})

let app = new Vue({
    el: '#app',
    data: {

    },
    methods: {

    }
})