<template>
    <div class="char-movelist">
        <div class="head disable-select">
        	<div class="char-menu-open" v-on:click="showCharacterList()">
        		<i class="fa fa-exchange" aria-hidden="true"></i>
        	</div>
    		<div id="selected-title" class="move-head">
    		    {{ characterName }}
    		    <i v-if="loading" class="loader fa fa-spinner" aria-hidden="true"></i>
		    </div>
    		<div class="opt-buttons">
    			<div class="btn-preferences" v-on:click="togglePreferences()">Preferences</div>
    			<div class="btn-filter" v-on:click="toggleFilters()">Filter</div>
    		</div>
        </div>
        <div id="movelist_tab" class="inner-table">
    		<table class="move-table">
    		    <tr v-for="move in filteredMoveList" :class="{ loading: loading }">
    		        <move-card-special v-if="move.isSpecial()" :move="move"></move-card-special>
    		        <move-card v-else :move="move"></move-card>
		        </tr>
    		</table>
    	</div>
    </div>
</template>

<style lang="scss">
.char-movelist {
    /*width: 600px;*/
    max-width: 970px;
    height: 100%;
    margin-left: 3px;
}

@media only screen and (max-width: 1130px) {
    .char-movelist {
        max-width: 80vw;
    }
}

@media only screen and (max-width: 801px) {

    .char-movelist {
        max-width: 98vw;
    }
}

.char-movelist .head {
    margin-left: 25px;
    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;

    @media only screen and (max-width: 800px) {
        align-items: center;
        margin-left: 5px;
    }

    .move-head {
        color: #ffffff;
        font-family: "Trump", Arial, sans-serif;
        font-size: 40px;
        font-style: italic;
        text-transform: uppercase;
        text-shadow: 0 0 6px hsla(0, 100%, 47%, 1);
        margin: 3px 15px 3px 0px;

        @media only screen and (max-width: 800px) {
            font-size: 22px;
        }
    }

    .opt-buttons {
        display: block;
        color: #ffffff;

        .btn-preferences, .btn-filter {
            display: inline-block;
            font-size: 20px;
            font-weight: bold;
            background-color: hsla(193, 77%, 20%, 0.75);
            padding-left: 15px;
            padding-right: 15px;
            margin-right: 5px;
            border-radius: 5px;
            font-family: "Core Sans G", Arial, sans-serif;
            text-transform: uppercase;
            text-shadow: 0 0 6px hsla(181, 92%, 50%, 1);
            cursor: pointer;
            vertical-align: middle;
            height: 25px;
            line-height: 25px;

            @media only screen and (max-height: 800px){
                height: 20px;
                font-size: 15px;
                padding-left: 5px;
                padding-right: 5px;
                margin-right: 5px;
                line-height: 20px;
            }
        }

        *:hover {
            background-color: hsla(193, 76%, 30%, 0.75);
        }

        *:active {
            background-color: hsla(193, 77%, 12%, 0.75);
        }
    }
}

@media only screen and (max-width: 801px) {
    .move-head {
        font-size: 35px;
    }
}

.move-table {
    /*background-color: rgba(0,0,0,0.25);*/
    border: 1px solid hsla(193, 77%, 40%, 0.25);
    margin-top: 2px;
    border-radius: 2px;
    max-width: 100%;
    //width: auto;
}

.loader {
    margin-left: 10px;
    animation: spin 1.5s linear infinite;
}

.loading {
    opacity: 0.5;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>

<script>
import MoveCard from './move-card.vue';
import MoveCardSpecial from './move-card-special.vue';
import { filterMoveList } from './../js/filters.js';
import { mutations, actions } from './../js/store.js';

export default {
    methods: {
        showCharacterList() {
            this.$store.commit(mutations.TOGGLE_CHARACTER_LIST);
        },

        togglePreferences() {
            this.$store.commit(mutations.TOGGLE_PREFERENCES_DIALOG);
            this.$store.commit(mutations.HIDE_CHARACTER_LIST);
        },

        toggleFilters() {
            this.$store.commit(mutations.TOGGLE_FILTERS_DIALOG);
            this.$store.commit(mutations.HIDE_CHARACTER_LIST);
        },
    },

    computed: {
        characterName() {
            let selectedCharacter = this.$store.state.selectedCharacter;
            let characterList = this.$store.state.characterList;
            let character = characterList.find((char) => char.getId() == selectedCharacter);

            if (character) {
                return character.getFullName();
            } else {
                return 'Character unknown';
            }
        },

        moveList() {
            return this.$store.state.moveList;
        },

        filteredMoveList() {
            return filterMoveList(this.moveList, this.$store.state.filters);
        },

        loading() {
            return this.$store.state.loadingMoveList;
        }
    },

    components: {
        MoveCard,
        MoveCardSpecial,
    }
};
</script>