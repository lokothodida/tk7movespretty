<template>
    <div id="preferences" class="preferences-dialog" v-bind:style="{ visibility }">
    	<div class="pref-title disable-select">
    		Preferences
    	</div>
    	<table class="pref-list">
    		<tr class="pref-language">
    			<td class="pref-id disable-select">Language</td>
    			<td class="pref-selection">
    			  	<select v-model="language" :change="updatePreferences()">
                        <option v-for="(option, index) in languages" v-bind:value="index">
                            {{ option }}
                        </option>
                    </select>
    			</td>
    		</tr>
    		<tr class="pref-platform">
    			<td class="pref-id disable-select">Button Layout</td>
    			<td class="pref-selection">
                    <select v-model="buttonLayout" :change="updatePreferences()">
                        <option v-for="option in buttonLayouts" v-bind:value="option.value">
                            {{ option.text }}
                        </option>
                    </select>
    			</td>
    		</tr>
    	</table>
    	<div class="pref-close disable-select" v-on:click="hide()"><i class="fa fa-times" aria-hidden="true"></i></div>
    </div>
</template>

<style lang="scss">
.preferences-dialog {
    position: absolute;
    left: calc(50vw - 400px);
    top: calc(50vh - 300px);
    width: 98vw;
    height: 98vh;
    max-width: 800px;
    max-height: 600px;
    background-color: rgba(0,0,0,0.85);
    border: 3px solid hsla(193, 77%, 20%, 0.85);
    border-radius: 5px;
    visibility: hidden;
    color: #ffffff;
    font-family: "Core Sans G";

    @media only screen and (max-height: 800px) {
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    .pref-title {
        position: relative;
        font-family: "Trump";
        font-style: italic;
        font-size: 30px;
        text-transform: uppercase;
        padding: 5px;
        margin-left: 15px;
        margin-right: 15px;
        text-shadow: 0 0 5px #0af1f5;
        border-bottom: 2px solid rgba(12, 73, 90, 0.85);
    }

    .pref-close {
        position: absolute;
        right: 10px;
        top: 5px;
        font-size: 30px;

        cursor: pointer;
        color: #ffffff;
        z-index: 9999;

        :hover {
            text-shadow: 0 0 10px #0af1f5;
        }
    }

    .pref-list {
        tr {
            margin-top: 10px;
            margin-left: 20px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text-align: left;
            vertical-align: middle;
            max-width: 350px;
        }

        .pref-id {
            display: inline-block;
            font-size: 20px;
            text-transform: uppercase;
            text-shadow: 0 0 5px #0af1f5;
        }

        .pref-selection {
            display: inline-block;
            vertical-align: middle;
            select, input {
                font-family: "Core Sans G";
                font-size: 20px;
                text-transform: uppercase;
                color: #ffffff;
                background-color: rgba(0,0,0,0);
                border: 2px solid rgba(12, 73, 90, 0.85);
                border-radius: 5px;

                option {
                    background-color: rgba(0,0,0,1);
                    color: #ffffff;
                }
            }

            select:focus, input:focus {
                outline: none;
            }
        }

        @media only screen and (max-width: 400px) {
            tr {
                width: calc(100vw - 30px);
                margin-left: 10px;
            }

            .pref-id, .pref-selection > select {
                font-size: 17px;
            }
        }
    }

}
</style>

<script>
import { mutations, actions } from './../js/store.js';

export default {
    data() {
        return {
            buttonLayout: this.$store.state.preferences.buttonLayout,
            language: this.$store.state.preferences.language,
        };
    },

    methods: {
        hide() {
            this.$store.commit(mutations.TOGGLE_PREFERENCES_DIALOG);
        },

        updatePreferences() {
            let previousLanguage = this.$store.state.preferences.language;

            this.$store.commit(mutations.UPDATE_PREFERENCES, {
                buttonLayout: this.buttonLayout,
                language: this.language,
            });

            if (previousLanguage != this.language) {
                this.$store.dispatch(actions.FETCH_MOVE_LIST, {
                    characterId : this.$store.state.selectedCharacter,
                });
            }
        }
    },

    computed: {
        visibility() {
            return this.$store.state.preferences.showDialog ? 'visible' : 'hidden';
        },

        buttonLayouts() {
            return this.$store.state.preferences.buttonLayouts;
        },

        languages() {
            return this.$store.state.preferences.languages;
        }
    }
};
</script>