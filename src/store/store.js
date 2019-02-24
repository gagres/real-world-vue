import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';

import * as user from '@/store/modules/user.js';
import * as event from '@/store/modules/event.js';
import * as notification from '@/store/modules/notification.js';

Vue.use(Vuex);

// JUST AN EXAMPLE OF Vuex Store Managements
const exampleStateManagement = new Vuex.Store({
  state: {
    loadingStatus: 'loading',
    todos: []
  },
  mutations: {
    SET_LOADING_STATUS(state, status) {
      state.loadingStatus = status
    },
    SET_TODOS(state, todos) {
      state.todos = todos;
    }
  }, // Commit + track State changes
  actions: {
    fetchTodos(context) {
      context.commit('SET_LOADING_STATUS', 'loading')
      axios.get('/api/todos').then((response) => {
        context.commit('SET_LOADING_STATUS', 'notLoading');
        context.commit('SET_TODOS', response.data.todos);
      });
    }
  },
  getters: {
    doneTodos(state) {
      return state.todos.filter(todo => todo.done);
    }
  }, // Same computed properties
});

const vuexInPractice = new Vuex.Store({
  state: {
    categories: ['sustainability', 'nature', 'animal welfare', 'housing', 'education', 'food', 'community'],
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false },
      { id: 3, text: '...', done: true },
      { id: 4, text: '...', done: false }
    ]
  },
  // Synchronous
  mutations: {},
  // Asynchronous
  actions: {},
  getters: {
    catLength: state => state.categories.length,
    doneTodos: state => state.todos.filter(todo => todo.done),
    activeTodosCount: (state, getters) => {
      return state.todos.length - getters.doneTodos.length;
    },
    // Passing properties to getters
    getEventById: state => id => {
      return state.events.find(event => event.id === id);
    }
  },
})

export default new Vuex.Store({
  modules: {
    user,
    event,
    notification,
  },
  state: {
    categories: ['sustainability', 'nature', 'animal welfare', 'housing', 'education', 'food', 'community'],
  }
});
