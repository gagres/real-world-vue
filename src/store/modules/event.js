import EventService from '@/services/EventService.js';

export const namespaced = true;

export const state = {
    events: [],
    totalEvents: 0,
    event: {},
    perPage: 3
}
export const mutations = {
    ADD_EVENT(state, event) {
      state.events.push(event);
    },
    SET_EVENTS(state, events) {
      state.events = events;
    },
    SET_TOTAL_EVENTS(state, totalEvents) {
      state.totalEvents = totalEvents;
    },
    SET_EVENT(state, event) {
      state.event = event;
    }
};
  
export const actions = {
    createEvent({ commit, dispatch, rootState }, event) {

      console.log('User creating Event is ' + rootState.user.user.name)

      return EventService
        .postEvent(event)
        .then(() => {
          commit('ADD_EVENT', event);
          const notification = {
            type: 'success',
            message: 'Your event has been created'
          }

          dispatch('notification/add', notification, { root: true });
        })
        .catch((error) => {
          const notification = {
            type: 'error',
            message: 'There was a problem creating event:' + error.message
          }

          dispatch('notification/add', notification, { root: true });
          throw error;
        })
    },
    fetchEvents({ commit, dispatch, state }, { page }) {
      return EventService.getEvents(state.perPage, page)
        .then(response => {
          commit('SET_EVENTS', response.data);
          commit('SET_TOTAL_EVENTS', response.headers['x-total-count']);
        })
        .catch(error => {
          const notification = {
            type: 'error',
            message: 'There was a problem fetching events: ' + error.message
          };

          dispatch('notification/add', notification, { root: true }); // Using an action of another module
        });
    },
    fetchEvent({ commit, getters }, id) {
      const event = getters.getEventById(id);

      if (event) {
        commit('SET_EVENT', event);
        return event;
      }
      return EventService.getEvent(id)
        .then(response => {
          commit('SET_EVENT', response.data);
          return response.data;
        })
    }
}

export const getters = {
    getEventById: state => id => {
      return state.events.find(event => event.id === id);
    }
};