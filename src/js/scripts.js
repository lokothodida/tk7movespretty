/*!
 * =============================
 * =	Mike Pinto             =
 * =	mspkvp@github.com      =
 * =	©2017 tk7movespretty   =
 * ============================= */
import * as d3 from 'd3';
import Cookies from 'cookies';
import * as View from './view.js';
import * as filters from './filters.js';
import { loadJson } from './utils.js';
import State from './state.js';
import Move from './move.js';

(function(exports) {
'use strict';

let state = new State();

function setLang(selectedLanguage) {
    state.set('lang', parseInt(selectedLanguage));
    state.save();
    fetchMoveList(state.get('selectedCharacter'));
}

function changePlatform(platform) {
    state.set('buttonLayout', platform);
    state.save();
    fetchMoveList(state.get('selectedCharacter'));
}

function selectCharacter(index) {
    // remove other moves
    d3.select(".move-table").remove();
    d3.select(".char-movelist .inner-table").html(`<table class="move-table"></table>`);

    // de-select card
    let characterData     = state.get('characterData');
    let selectedCharacter = index;
    let id_string         = characterData[selectedCharacter].c.split(" ");

    d3.select("#" + id_string[0]).classed("selected", false);
    d3.select("#" + id_string[0]).classed("selected", true);
    d3.select("#selected-title").text(characterData[selectedCharacter].n);

    state.set('selectedCharacter', selectedCharacter);
    state.save();

    if (state.get('showCharMenuDialog')) {
        toggleCharMenu();
    }
}

function togglePreferences() {
    let showPrefDialog = state.get('showPrefDialog');

    if (showPrefDialog) {
        d3.select("#preferences").style('visibility', 'hidden');
    } else {
        d3.select("#preferences").style('visibility', 'visible');
    }

    state.set('showPrefDialog', !showPrefDialog);
}

function toggleFilter() {
    let showFilterDialog = state.get('showFilterDialog');

    if (showFilterDialog) {
        d3.select("#filter").style('visibility', 'hidden');
    } else {
        d3.select("#filter").style('visibility', 'visible');
    }

    state.set('showFilterDialog', !showFilterDialog);
}

function toggleCharMenu() {
    let showCharMenuDialog = state.get('showCharMenuDialog');

    if (showCharMenuDialog) {
        d3.select("#charmenu").style('display', 'none');
    } else {
        d3.select("#charmenu").style('display', 'initial');
    }

    state.set('showCharMenuDialog', !showCharMenuDialog);
}

function importData() {
    state.load();

    loadJson("./assets/data/map_hits.json").then(function(data) {
        let hitsMap = state.get('hitsMap');

        for(var h in data) {
            hitsMap[data[h].i] = data[h].h;
        }

        state.set('hitsMap', hitsMap);

        return loadJson("./assets/data/map_ctrls.json");
    }).then(function(data) {
        state.set('ctrlsMap', data);

        return loadJson("./assets/data/map_chars.json");
    }).then(function(data) {
        let selectedCharacter = state.get('selectedCharacter');
        let characterData = state.get('characterData');

        for (let h in data) {
            characterData[data[h].i] = {
                c: data[h].c,
                n: data[h].n
            };
        }

        state.set('characterData', characterData);

        for (let i = 0; i < data.length; i++) {
            let tname = data[i].c_index.split(" ");

            if (data[i].i == "11") {
                tname = data[i].c.split("-");
            }

            d3.select(".char-menu > .inner-table > table")
                .append("tr")
                .html("<td class=\"char-card\" id=\""+data[i].c.split(" ")[0]+"\"><img src=\"./assets/chars/"+tname.join("").toLowerCase()+"_thumbnail.png\"><p>"+data[i].c+"</p></td>");

            d3.select("#"+data[i].c.split(" ")[0]).on("click", function() {
                fetchMoveList(data[i].i);
            });
        }

        let id_string = characterData[selectedCharacter].c.split(" ");
        d3.select("#"+id_string[0]).classed("selected", true);
        d3.select("#selected-title").text(characterData[selectedCharacter].n);

        fetchMoveList(selectedCharacter);
    });
}

function fetchMoveList(characterIndex) {
    loadJson("./assets/data/movelists/MOVELIST_" + characterIndex + ".json")
    .then(parseMoveList)
    .then(function(moves) {
        selectCharacter(characterIndex);
        state.set('currentMoveList', moves);

        View.renderMoveList(moves, state.get('buttonLayout'));
    }).catch(function(error) {
        console.log("Failed to render movelist", error);
    });
}

function parseMoveList(data) {
    let hitsMap  = state.get('hitsMap');
    let lang     = state.get('lang');
    let ctrlsMap = state.get('ctrlsMap');

    return data.moves.map((move) => {
        return new Move(move, lang, ctrlsMap, hitsMap);
    });
}

function filterMoveList() {
    let selectedCharacter = state.get('selectedCharacter');
    let filteredMoveList  = filters.filterMoveList(state.get('currentMoveList'));

    selectCharacter(selectedCharacter);
    View.renderMoveList(filteredMoveList, state.get('buttonLayout'));
}

exports.importData        = importData;
exports.toggleCharMenu    = toggleCharMenu;
exports.togglePreferences = togglePreferences;
exports.toggleFilter	  = toggleFilter;
exports.filterMoveList    = filterMoveList;
exports.setLang           = setLang;
exports.changePlatform    = changePlatform;

})(window);