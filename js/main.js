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
            column1: {title: "To do", cards: []},
            column2: {title: "In progress", cards: []},
            column3: {title: "Testing", cards: []},
            column4: {title: "Done", cards: []},
        }
    },
    mounted() {
        eventBus.$on('addNewCard', card => {
            this.column1.cards.push(card);
        });
        eventBus.$on('addToCol2', card => {
            this.column2.cards.push(card);
        });
        eventBus.$on('addToCol3', card => {
            this.column3.cards.push(card)
            this.column2.cards.splice(this.column2.cards.indexOf(card), 1);
        });
        eventBus.$on('addToCol4', card => {
            this.column4.cards.push(card);
            this.column3.cards.splice(this.column3.cards.indexOf(card), 1);
            card.completedDate = new Date().toLocaleDateString();
        })
    },
    methods: {},
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
                    deadline: this.deadline.split('-').reverse().join('.'),
                    createdDate: new Date(),
                    editingDate: new Date(),
                    editable: false,
                    marker: false,
                    completedDate: null,
                    transfer: false,
                    reasons: [],
                }
                eventBus.$emit('addNewCard', card);
                this.title = '';
                this.description = '';
                this.deadline = '';
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
        getFormattedDate(date) {
            let myDate = new Date(date);
            return myDate.getDate() + "." + (myDate.getMonth() + 1) + "." + myDate.getFullYear();
        },
        deleteCard(card) {
            this.column1.cards.splice(this.column1.cards.indexOf(card), 1);
        },
        changeStatus(card) {
            this.column1.cards.splice(this.column1.cards.indexOf(card), 1);
            eventBus.$emit('addToCol2', card);
        },
        updateCard(card) {
            card.editable = false
            card.marker = true
            this.column1.cards.push(card)
            this.column1.cards.splice(this.column1.cards.indexOf(card), 1)
            card.editingDate = new Date();
        }

    },
    template: `
   <div class="to-do-col">
    <h3>{{column1.title}}</h3>
    <div class="card" v-for="(card, index) in cards" :key="index">
    <div class="topBtn">
        <button class="btnEdit" @click="card.editable = true">✎</button>
        <button class="btnDel" @click="deleteCard(card)">X</button>
    </div>
      <h3>{{card.title}}</h3>
      <p class="card-desc">{{card.description}}</p>
      <span class="card-deadline">deadline: {{ card.deadline }}</span>
      <p class="card-created-date">creating: {{ getFormattedDate(card.createdDate) }}</p>
      <p v-if="card.marker" class="card-created-date">editing: {{ getFormattedDate(card.editingDate) }}</p> <br>
      <button class="btnMoveRight" type="button" @click="changeStatus(card)">→</button>
      <div class="editForm" v-if="card.editable">
         <form class="editForm" @submit.prevent="updateCard(card)">
            <label for="newTitle">New title:</label>
                <input id="newTitle" type="text" v-model="card.title" maxlength="30">
            <label for="newDesc">New description:</label>
                <textarea id="newDesc" v-model="card.description"></textarea>
            <button class="btnEdit" type="submit">Edit</button>
         </form>
      </div>
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
        getFormattedDate(date) {
            let myDate = new Date(date);
            return myDate.getDate() + "." + (myDate.getMonth() + 1) + "." + myDate.getFullYear();
        },
        deleteCard(card) {
            this.column2.cards.splice(this.column2.cards.indexOf(card), 1);
        },
        changeStatus(card) {
            eventBus.$emit('addToCol3', card);
        },
        updateCard(card) {
            card.editable = false
            card.marker = true
            this.column2.cards.push(card)
            this.column2.cards.splice(this.column2.cards.indexOf(card), 1)
            card.editingDate = new Date();
        }
    },
    template: `
   <div class="in-progress-col">
   <h3>{{ column2.title }}</h3>
   <div class="card" v-for="(card, index) in cards" :key="index">
   <div class="topBtn">
        <button class="btnEdit" @click="card.editable = true">✎</button>
        <button class="btnDel" @click="deleteCard(card)">X</button>
    </div>
      <h3>{{card.title}}</h3>
      <p class="card-desc">{{card.description}}</p>
      <span class="card-deadline">deadline: {{ card.deadline }}</span>
      <p class="card-created-date">created: {{ getFormattedDate(card.createdDate) }}</p>
      <p v-if="card.marker" class="card-created-date">editing: {{ getFormattedDate(card.editingDate) }}</p> <br>
      <p v-if="card.reasons.length">Reason for return:
          <ul class="card-created-date" v-for="(reason, index) in card.reasons">
            <li>{{ reason }}</li>
          </ul>
      </p>
      <button class="btnMoveRight" type="button" @click="changeStatus(card)">→</button>
      <div class="editForm" v-if="card.editable">
         <form class="editForm" @submit.prevent="updateCard(card)">
         <p>
              <label for="newTitle">New title</label>
              <input id="newTitle" type="text" v-model="card.title" maxlength="30" placeholder="Заголовок">
         </p>
              <p>New description: 
                   <textarea v-model="card.description" cols="20" rows="5"></textarea>
              </p>
              <p>
                 <button class="btnEdit" type="submit">Edit</button>
              </p>
         </form>
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
    computed: {
        cards() {
            return this.column3.cards;
        },
    },
    methods: {
        getFormattedDate(date) {
            let myDate = new Date(date);
            return myDate.getDate() + "." + (myDate.getMonth() + 1) + "." + myDate.getFullYear();
        },
        deleteCard(card) {
            this.column3.cards.splice(this.column3.cards.indexOf(card), 1);
        },
        changeStatus(card) {
            eventBus.$emit('addToCol4', card);
        },
        lastcol(card) {
            let reason_val = document.getElementById('reason_inp').value;
            card.reasons.push(reason_val)
            card.transfer = false
            this.column3.cards.splice(this.column3.cards.indexOf(card), 1)
            eventBus.$emit('addToCol2', card)
        },
        updateCard(card) {
            card.editable = false
            card.marker = true
            this.column3.cards.push(card)
            this.column3.cards.splice(this.column3.cards.indexOf(card), 1)
            card.editingDate = new Date();
        }
    },

    template: `
   <div class="testing-col">
   <h3>{{ column3.title }}</h3>
   <div class="card" v-for="(card, index) in cards" :key="index">
   <div class="topBtn">
        <button class="btnEdit" @click="card.editable = true">✎</button>
        <button class="btnDel" @click="deleteCard(card)">X</button>
   </div>
      <h3>{{card.title}}</h3>
      <p class="card-desc">{{card.description}}</p>
      <span class="card-deadline">deadline: {{ card.deadline }}</span>
      <p class="card-created-date">created: {{ getFormattedDate(card.createdDate) }}</p>
      <p v-if="card.marker" class="card-created-date">editing: {{ getFormattedDate(card.editingDate) }}</p> <br>
      <p v-if="card.reasons.length">Reason for return:
          <ul class="card-created-date" v-for="(reason, index) in card.reasons">
            <li>{{ reason }}</li>
          </ul>
      </p>
      <div class="topBtn">
          <button class="btnMoveRight" type="button" @click="card.transfer = true">←</button>
          <button class="btnMoveRight" type="button" @click="changeStatus(card)">→</button>
      </div>
      <div class="editForm" v-if="card.editable">
         <form class="editForm" @submit.prevent="updateCard(card)">
         <p>
              <label for="newTitle">New title</label>
              <input id="newTitle" type="text" v-model="card.title" maxlength="30" placeholder="Заголовок">
         </p>
              <p>New description: 
                   <textarea v-model="card.description" cols="20" rows="5"></textarea>
              </p>
              <p>
                 <button class="btnEdit" type="submit">Edit</button>
              </p>
         </form>
      </div>
      <div v-if="card.transfer">
          <form class="editForm" @submit.prevent="lastcol(card)">
               <label for="reason_inp">The reason of transfer</label>
                   <input type="text" id="reason_inp"> <br>
               <button style="margin-top: 10px" class="btnEdit" type="submit">OK</button>
          </form>
      </div>
   </div>

   </div>
    `,
})

Vue.component('col4', {
    data() {
        return {
            isXui: false,
        }
    },
    props: {
        column4: {
            type: Object,
        },
    },
    computed: {
        cards() {
            return this.column4.cards;
        },
    },
    methods: {
        getFormattedDate(date) {
            let myDate = new Date(date);
            return myDate.getDate() + "." + (myDate.getMonth() + 1) + "." + myDate.getFullYear();
        },
    },
    template: `
   <div class="done-col">
   <h3>{{ column4.title }}</h3>
   <div class="card" :class="{ notInTime: card.deadline<card.completedDate}" v-for="(card, index) in cards" :key="index">
      <h3>{{card.title}}</h3>
      <p class="card-desc">{{card.description}}</p>
      <span class="card-deadline">deadline: {{ card.deadline }}</span>
      <p class="card-created-date">done: {{ card.completedDate }}</p>
      <p v-if="card.marker" class="card-created-date">editing: {{ getFormattedDate(card.editingDate) }}</p> <br>
      <p v-if="card.reasons.length">Reason for return:
          <ul class="card-created-date" v-for="(reason, index) in card.reasons">
            <li>{{ reason }}</li>
          </ul>
          <br>
      </p>
      <p v-if="card.deadline >= card.completedDate">Сompleted in time</p>
      <p v-else>Not completed in time</p>
      </div>
   </div>
    `,
})

let app = new Vue({
    el: '#app',
    data: {},
    methods: {}
})