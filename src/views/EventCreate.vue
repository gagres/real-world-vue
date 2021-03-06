<template>
    <div>
        <h1>Create an Event</h1>
        <form @submit.prevent="createEvent">
          <BaseSelect 
            label="Select a category" 
            :options="categories" 
            v-model="event.category" 
            class="field" 
            @blur="$v.event.category.$touch()"
            :class="{ error: $v.event.category.$error }"
          />
          <template v-if="$v.event.category.$error">
            <p v-if="!$v.event.category.required" class="errorMessage">Category is required</p>
          </template>
          <h3>Name & describe your event</h3>
          <!-- <div class="field">
            <label>Title</label>
            <input v-model="event.title" type="text" placeholder="Add an event title"/>
          </div> -->
          <BaseInput 
            label="Title"
            v-model="event.title"
            type="text"
            placeholder="Title"
            class="field"
            @blur="$v.event.title.$touch()"
            :class="{ error: $v.event.title.$error }"
          />
          <template v-if="$v.event.title.$error">
            <p v-if="!$v.event.title.required" class="errorMessage">Title is required</p>
          </template>

          <BaseInput
            label="Description"
            v-model="event.description"
            type="text"
            placeholder="Description"
            class="field"
            :class="{ error: $v.event.description.$error}"
            @blur="$v.event.description.$touch()"
          />
          <template v-if="$v.event.description.$error">
            <p v-if="!$v.event.description.required" class="errorMessage">Description is required</p>
          </template>
          
          <h3>Where is your event?</h3>
          <BaseInput
            label="Location"
            v-model="event.location"
            type="text"
            placeholder="Add a location"
            class="field"
            :class="{ error: $v.event.location.$error}"
            @blur="$v.event.location.$touch()"
          />
          <template v-if="$v.event.location.$error">
            <p v-if="!$v.event.location.required" class="errorMessage">Location is required</p>
          </template>

          <h3>When is your event?</h3>
          <div class="field">
            <label>Date</label>
            <DatePicker
              v-model="event.date"
              placeholder="Select a date"
              @opened="$v.event.date.$touch()"
              :input-class="{ error: $v.event.date.$error }"/>
          </div>
          <template v-if="$v.event.date.$error">
            <p v-if="!$v.event.date.required" class="errorMessage">Date is required</p>
          </template>

          <BaseSelect 
            label="Select a time" 
            :options="times" 
            v-model="event.time"
            class="field"
            @blur="$v.event.time.$touch()"
            :class="{ error: $v.event.time.$error }"/>
          <template v-if="$v.event.time.$error">
            <p v-if="!$v.event.time.required" class="errorMessage">Time is required</p>
          </template>

          <!-- <input type="submit" class="button -fill-gradient" value="Submit"/> -->
          <BaseButton
            type="submit"
            buttonClass="-fill-gradient"
            :disabled="$v.$invalid"
          >Submit</BaseButton>
          <p v-if="$v.$anyError" class="errorMessage">Please fill out the required fields</p>
        </form>
    </div>
</template>

<script>
import DatePicker from 'vuejs-datepicker'
import NProgress from 'nprogress'
import { required } from 'vuelidate/lib/validators'

export default {
    components: {
        DatePicker
    },
    data() {
        const times = [];
        for (let i = 0; i < 24; i++) {
            times.push(i + ':00');
        }
        return {
            times,
            event: this.createFreshEventObject(),
            categories: this.$store.state.categories
        }
    },
    methods: {
        createEvent() {
          this.$v.$touch();
          if (!this.$v.$error) {
            NProgress.start()
            this.$store.dispatch('event/createEvent', this.event)
                .then(() => {
                  this.$router.push({
                    name: 'event-show',
                    params: { id: this.event.id }
                  })
                  this.event = this.createFreshEventObject();
                })
                .catch(() => {})
          }
        },
        createFreshEventObject() {
            const user = this.$store.state.user.user;
            const id = Math.floor(Math.random() * 1000000);

            return {
                id,
                user,
                category: '',
                organizer: user,
                title: '',
                description: '',
                location: '',
                date: '',
                time: '',
                attendees: []
            }
        }
    },
    validations: {
      event: {
        category: { required},
        title: { required },
        description: { required },
        location: { required },
        date: { required },
        time: { required }
      }
    }
}
</script>

<style scoped>
.field {
    margin-bottom: 24px;
}
</style>
