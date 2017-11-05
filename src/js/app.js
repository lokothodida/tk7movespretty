/*!
 * =============================
 * =	Mike Pinto             =
 * =	mspkvp@github.com      =
 * =	©2017 tk7movespretty   =
 * ============================= */
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import App from './../components/app.vue';
import { store, actions } from './store.js';
import router from './router.js';

(() => new Vue({
    el: '#app',

    store: new Vuex.Store(store),

    router: new VueRouter(router),

    watch: {
        '$route' (to, from) {
            // Ensure character is loaded when coming from index page
            if (from.name != 'character' && to.name == 'character') {
                this.selectCharacterFromRoute(to);
            }
        },
    },

    created() {
        let store = this.$store;
        let route = this.$route;

        store.dispatch(actions.INITIALIZE_APP)
            .then(() => {
                if (route.name == 'character') {
                    this.selectCharacterFromRoute(route);
                }
            });
    },

    methods: {
        selectCharacterFromRoute(route) {
            this.$store.dispatch(actions.SELECT_CHARACTER_BY_SLUG, {
                slug: route.params.characterSlug
            });
        }
    },

    components: {
        App,
    }
}))();