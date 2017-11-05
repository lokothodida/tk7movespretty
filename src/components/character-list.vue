<template>
    <div id="charmenu" class="char-menu disable-select" :class="{ hidden: visibility }">
	    <table class="head">
			<tr>
				<td class="char-menu-close" v-on:click="hideCharacterList()">
					<i class="fa fa-times" aria-hidden="true"></i>
				</td>
				<td class="char-head">CHARACTERS</td>
			</tr>
	    </table>
	    <div class="inner-table">
		    <table>
		        <tr v-for="(character, index) in characters">
		            <td class="char-card" :class="{ selected: selected == character.getId() }" :id="character.getSlug()" v-on:click="selectCharacter(character.getId())">
                        <router-link :to="getCharacterLink(character)">
                            <img :src="getThumbnail(character)">
                            <p>{{ character.getName() }}</p>
                        </router-link>
                    </td>
                </tr>
			</table>
	    </div>
	</div>
</template>

<style lang="scss">
.char-menu {
    width: 200px;
    height: 100%;
    margin-left: 5px;

    @media only screen and (max-width: 800px){
        position: absolute;
        background-color: rgba(0,0,0,0.85);
        z-index: 10;
        margin-left: 3px;
        width: 155px;
        border: 1px solid rgba(12,73,90,.75);
        height: 100%;
        border-radius: 5px;
        display: none;
    }
}

.char-menu ::-webkit-scrollbar {
    width: 8px;
    @media only screen and (max-width: 800px){
        width: 5px;
    }
}

.char-menu .head {
    width: 100%;
}

.char-menu .inner-table {
    @media only screen and (max-width: 800px){
        height: calc(100% - 40px);
    }
}

.char-menu-open {
    width: 30px;
    font-size: 20px;
    color: #ffffff;
    text-shadow: 0 0 6px #0af1f5;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 44px;
    padding: 3px 0px 3px 0px;
    border: 1px solid rgba(12,73,90,.75);
    display: none;
    cursor: pointer;

    @media only screen and (max-width: 800px){
        display: initial;
    }

}

.char-menu-open:active {
    background-color: rgba(7,44,54,.75);
}

.char-menu-close {
    font-size: 25px;
    width: 25px;
    color: #ffffff;
    vertical-align: middle;
    text-align: right;
    padding: 3px 2px 2px 2px;
    text-shadow: 0 0 10px #fd0106;
    display: none;
    cursor: pointer;

    @media only screen and (max-width: 800px){
        display: table-cell;
    }
}

.char-menu-close:active {
    text-shadow: 0 0 10px #fd0106;
}

.char-head {
    color: #ffffff;
    font-family: "Trump", Arial, sans-serif;
    font-size: 40px;
    font-style: italic;
    text-shadow: 0 0 5px hsla(181, 92%, 50%, 1);
    text-transform: uppercase;
    text-align: center;

    @media only screen and (max-width: 800px) {
        font-size: 25px;
        vertical-align: middle;
        text-align: left;
        padding-left: 5px;
    }
}

.char-card {
    overflow: hidden;
    position: relative;
    display: block;
    height: 100px;
    border: 2px solid hsla(193, 77%, 20%, 0.75);
    background-color: rgba(0,0,0,0.50);
    border-radius: 3px;

    @media only screen and (max-width: 800px) {
        border-width: 1px;
        height: 75px;
        width: 140px;
    }
}

.char-card:hover {
    border: 2px solid hsla(193, 77%, 40%, 0.75);
    /*box-shadow: inset 0 0 14px 4px hsla(193, 77%, 40%, 0.75);*/
    outline: none;
    cursor: pointer;

    -webkit-animation-duration: 0.5s;
    -webkit-animation-name: char-card-glow;
    -webkit-animation-direction: alternate;
    -webkit-animation-iteration-count: infinite;
    animation-duration: 0.5s;
    animation-name: char-card-glow;
    animation-direction: alternate;
    animation-iteration-count: infinite;

}

@-webkit-keyframes char-card-glow {
    from { box-shadow: inset 0 0 100px 0px hsla(193, 77%, 40%, 0.75);  }
    to { box-shadow: inset 0 0 150px 10px hsla(193, 77%, 40%, 0.75); }
}

.selected {
    border: 2px solid hsla(193, 77%, 40%, 0.75);
    box-shadow: inset 0 0 14px 4px hsla(193, 77%, 40%, 0.75);
}

.char-card img {
    width: 100%;
    height: auto;
    position: absolute;
    bottom: 0px;
    right: 0px;
}

.char-card p {
    color: #ffffff;
    font-family: "Core Sans G", Arial, sans-serif;
    font-style: italic;
    background-color: rgba(10,10,10,0.50);
    font-size: 25px;
    text-transform: uppercase;
    text-align: left;
    padding-left: 5px;
    width: 100%;
    bottom: 0px;
    margin: 0 0 0 -1px;
    position: absolute;

    @media only screen and (max-width: 800px) {
        font-size: 15px;
    }
}

.hidden {
    display: initial !important;
}

@media only screen and (max-width: 800px) {
    .hidden {
        display: none;
    }
}
</style>

<script>
import { mutations, actions } from './../js/store.js';

export default {
    methods: {
        hideCharacterList() {
            this.$store.commit(mutations.TOGGLE_CHARACTER_LIST);
        },

        getThumbnail(character) {
            return `./assets/chars/${character.getThumbnailName()}_thumbnail.png`;
        },

        getCharacterLink(character) {
            return `/character/${character.getSlug().toLowerCase()}/`;
        },

        selectCharacter(characterId) {
            this.$store.dispatch(mutations.SELECT_CHARACTER, { characterId: characterId });
        },
    },

    computed: {
        visibility() {
            return this.$store.state.showCharacterList;
        },

        characters() {
            return this.$store.state.characterList;
        },

        selected() {
            return this.$store.state.selectedCharacter;
        }
    }
};
</script>