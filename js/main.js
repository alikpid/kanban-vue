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
            column1: [],
            column2: [ { title: "In Progress", cards: [] } ],
            column3: [ { title: "Testing", cards: [] } ],
            column4: [ { title: "Done", cards: [] } ],
        }
    },
    mounted() {
        this.column1 = JSON.parse(localStorage.getItem('column1')) || [];
        eventBus.$on('addNewCard', card => {
            this.column1.push(card);
            this.saveColumn1();
        });
        eventBus.$on('saveColumn1', () => {
            this.saveColumn1();
        });
    },
    methods: {
        saveColumn1() {
            localStorage.setItem('column1', JSON.stringify(this.column1));
        },
    },
    computed: {
        column2length() {
            return this.column2.length;
        }
    }
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
                <label for="title">Title</label>
                <input type="text" id="title" v-model="title">
            </p>
            <p>
                <label for="description">Description</label>
                <textarea type="text" id="description" v-model="description"></textarea>
            </p>
            <p>
                <label for="deadline">Deadline</label>
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
      column1: {
          type: Array
      }
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
                    createdDate: new Date().toLocaleString(),
                    status: 'todo',
                    editable: false
                }
                eventBus.$emit('addNewCard', card);
                eventBus.$emit('saveColumn1');
                this.title = '';
                this.description = '';
                this.deadline = '';
                this.createdDate = '';

            }
        }
    },
})

Vue.component('col1', {
    props: {
        column1: {
            type: Array,
        },
        card: {
            type: Object
        },
    },
    template: `
   <div class="to-do-col">
   <h3>To do</h3>
        <div class="card" v-for="(card, index) in column1" :key="index">
            <h3>{{card.title}}</h3>
            <p class="card-desc">{{card.description}}</p>
            <span class="card-deadline">{{card.deadline}}</span>
        </div>
   </div>
    `,
    // methods: {
    //     changeAchievement(note, item) {
    //         item.completed = !item.completed
    //         note.progress = 0
    //
    //         for (let i = 0; i < note.noteItems.length; ++i)
    //             if (note.noteItems[i].completed === true)
    //                 note.progress++;
    //         if ((note.progress / note.noteItems.length) * 100 >= 50) {
    //             eventBus.$emit('addToCol2', note);
    //         }
    //     },
    //
    // },
})

Vue.component('col2', {
    props: {
        column2: {
            type: Array,
        },
        // note: {
        //     type: Object
        // },
        // errors2: {
        //     type: Array
        // }
    },

    template: `
   <div class="in-progress-col">
   <h3>In progress</h3>
<!--        <div class="error" v-for="error in errors2" :key="error.name">{{error}}</div>-->
<!--       <ul class="note" v-for="note in column2" :key="note.date">-->
<!--            <li>{{note.title}}  -->
<!--            <ol>-->
<!--                <li class="items" v-for="item in note.noteItems" :key="item.title">-->
<!--                    <input type="checkbox" :checked="item.completed" @click="changeAchievement(note, item)" id="item">-->
<!--                    <label for="item">{{item.title}}</label>-->
<!--                </li>-->
<!--            </ol>-->
<!--            </li>-->
<!--        </ul>-->
        
        
   </div>
    `,
    // methods: {
    //     changeAchievement(note, item) {
    //         item.completed = !item.completed;
    //         note.progress = 0;
    //         for (let i = 0; i < note.noteItems.length; ++i)
    //             if (note.noteItems[i]?.completed === true)
    //                 note.progress++;
    //         if ((note.progress / note.noteItems.length) * 100 === 100) {
    //             eventBus.$emit('addToCol3', note);
    //             note.date = new Date().toLocaleString();
    //         }
    //
    //     },
    // },
})

Vue.component('col3', {
    props: {
        column3: {
            type: Array,
        },
    },
    template: `
   <div class="testing-col">
   <h3>Testing</h3>
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
        column3: {
            type: Array,
        },
        note: {
            type: Object
        },
        errors: {
            type: Array
        }
    },
    template: `
   <div class="done-col">
   <h3>Done</h3>
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