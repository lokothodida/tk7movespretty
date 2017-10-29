<template>
    <div id="filters" class="filters-dialog preferences-dialog" v-bind:style="{ visibility }">
        <div class="pref-title disable-select">
            Filter

            <a href="#" class="reset" v-on:click.prevent="reset()">Reset Filters</a>
        </div>
        <table class="pref-list">
            <tr class="pref-language">
                <td class="label disable-select">Move name</td>
                <td>
                    <span class="input-wrapper">
                        <input type="text" id="move-name-filter" v-model="moveName" v-on:keyup="updateFilters()"/>
                    </span>
                </td>
            </tr>
            <tr class="pref-language">
                <td class="label disable-select">Move string</td>
                <td>
                    <span class="input-wrapper">
                        <input type="text" id="move-string-filter" v-model="moveString" v-on:keyup="updateFilters()"/>
                    </span>
                </td>
            </tr>
            <tr class="pref-language">
                <td class="label disable-select">Special Properties</td>
                <td class="pref-selection">
                    <div class="checkbox-wrapper">
                        <label>SPIN</label>
                        <div class="checkbox">
                            <input id="move-property-spin-filter" type="checkbox" v-model="specialProperties.spin" :change="updateFilters()"/>
                            <label for="move-property-spin-filter"></label>
                        </div>
                    </div>
                    <div class="checkbox-wrapper">
                        <label>TRACK</label>
                        <div class="checkbox">
                            <input id="move-property-track-filter" type="checkbox" v-model="specialProperties.track" :change="updateFilters()"/>
                            <label for="move-property-track-filter"></label>
                        </div>
                    </div>
                    <div class="checkbox-wrapper">
                        <label>ARMOR</label>
                        <div class="checkbox">
                            <input id="move-property-armor-filter" type="checkbox" v-model="specialProperties.armor" :change="updateFilters()"/>
                            <label for="move-property-armor-filter"></label>
                        </div>
                    </div>
                </td>
            </tr>
            <tr class="pref-language">
                <td class="label disable-select">Frames</td>
                <td class="pref-selection">
                    <p class="frame-options">
                        <label>START</label>
                        <select id="frame-property-start-comparison-filter" v-model="frameProperties.start.comparison" :change="updateFilters()">
                            <option v-for="option in comparisons" :value="option">{{ option }}</option>
                        </select>
                        <input class="frame-amount" type="number" v-model="frameProperties.start.value" v-on:keyup="updateFilters()"/>
                    </p>
                    <p class="frame-options">
                        <label>BLOCK</label>
                        <select id="frame-property-block-comparison-filter" v-model="frameProperties.block.comparison" :change="updateFilters()">
                            <option v-for="option in comparisons" :value="option">{{ option }}</option>
                        </select>
                        <input class="frame-amount" type="number" v-model="frameProperties.block.value" v-on:keyup="updateFilters()"/>
                    </p>
                    <p class="frame-options">
                        <label>HIT</label>
                        <select id="frame-property-hit-comparison-filter" v-model="frameProperties.hit.comparison" :change="updateFilters()">
                            <option v-for="option in comparisons" :value="option">{{ option }}</option>
                        </select>
                        <input class="frame-amount" type="number" v-model="frameProperties.hit.value" v-on:keyup="updateFilters()"/>
                    </p>
                </td>
            </tr>
        </table>
        <div class="pref-close disable-select" v-on:click="toggle()"><i class="fa fa-times" aria-hidden="true"></i></div>
    </div>
</template>

<style>
.reset {
    color: #fff;
    text-decoration: none;
    float: right;
    margin-right: 30px;
}

.filters-dialog .pref-list {
    display: table;
}

.filters-dialog .pref-list tr {
    display: table-row;
}

.filters-dialog .pref-list .label {
    width: 30%;
}

.filters-dialog .pref-list td {
    padding: 10px;
    font-size: 20px;
    text-transform: uppercase;
    text-shadow: 0 0 5px #0af1f5;
    display: table-cell;
}

.filters-dialog input[type="text"] {
    font-family: "Core Sans G";
    font-size: 20px;
    color: #fff;
    background-color: transparent;
    border: 2px solid rgba(12,73,90,.85);
    border-radius: 5px;
}

.filters-dialog .frame-options {
    display: flex;
}

.filters-dialog .frame-options label {
    margin: 5px;
    flex-grow: 2;
}

.filters-dialog .frame-options select {
    margin: 5px;
    flex-grow: 1;
}

.filters-dialog .frame-options input {
    margin: 5px;
    flex-grow: 2;
}

.filters-dialog .frame-amount {
    width: 50px;
}

.input-wrapper {
    display: block;
    padding: 5px;
}

.input-wrapper input {
    width: 100%;
}

.checkbox-wrapper {
    height: 40px;
}

.checkbox-wrapper label {
    display: block;
    float: left;
    line-height: 40px;
    margin-right: 10px;
}

/**
  * @link https://paulund.co.uk/style-checkboxes-with-css
  */
.checkbox {
    width: 25px;
    margin: 5px;
    position: relative;
    display: inline;
}

.checkbox label {
    cursor: pointer;
    position: absolute;
    width: 25px;
    height: 25px;
    top: 0;
    left: 0;
    background: #000;
    border: 2px solid rgba(12,73,90,.85);
    border-radius: 5px;
}

.checkbox label:after {
    opacity: 0.2;
    content: '';
    position: absolute;
    width: 9px;
    height: 5px;
    background: transparent;
    top: 6px;
    left: 7px;
    border: 3px solid rgba(12,73,90,.85);
    border-top: none;
    border-right: none;

    transform: rotate(-45deg);
}

.checkbox label:hover::after {
    opacity: 0.5;
}

.checkbox input[type=checkbox]:checked + label:after {
    opacity: 1;
}

:focus {
    outline: none;
}
</style>

<script>
let defaultFilters = {
    moveName: '',

    moveString: '',

    specialProperties: {
        spin: false,
        armor: false,
        track: false,
    },

    frameProperties: {
        start: {
            value: '',
            comparison: '=',
        },
        block: {
            value: '',
            comparison: '=',
        },
        hit: {
            value: '',
            comparison: '=',
        },
    },

    comparisons: ['=', '<=', '<', '>=', '>']
};

export default {
    data() {
        return Object.assign({}, defaultFilters);
    },

    methods: {
        toggle() {
            this.$store.commit('toggleFiltersDialog');
        },

        reset() {
            this.moveName          = defaultFilters.moveName;
            this.moveString        = defaultFilters.moveString;
            this.specialProperties = Object.assign({}, defaultFilters.specialProperties);
            this.frameProperties   = Object.assign({}, defaultFilters.frameProperties);

            this.updateFilters();
        },

        updateFilters() {
            this.$store.commit('updateFilters', {
                moveName: this.moveName,
                moveString: this.moveString,
                specialProperties: this.specialProperties,
                frameProperties: this.frameProperties,
            });
        }
    },

    computed: {
        visibility() {
            return this.$store.state.filters.showDialog ? 'visible' : 'hidden';
        }
    }
}
</script>