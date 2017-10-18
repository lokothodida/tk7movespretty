/*!
 * =============================
 * =	Mike Pinto             =
 * =	mspkvp@github.com      =
 * =	©2017 tk7movespretty   =
 * ============================= */
import * as d3 from 'd3';
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

    loadHitsMap()
    .then(() => loadControlsMap())
    .then(() => loadCharacterList())
    .then(() => {
        let selectedCharacter = state.get('selectedCharacter');
        let characterList     = sortCharacterList(state.get('characterData'));

        View.renderCharacterList(characterList, selectedCharacter);
        fetchMoveList(selectedCharacter);
    });
}

function loadHitsMap() {
    return loadJson("./assets/data/map_hits.json")
    .then(function(data) {
        let hitsMap = {};

        for (var h in data) {
            hitsMap[data[h].i] = data[h].h;
        }

        state.set('hitsMap', hitsMap);

        return hitsMap;
    })
}

function loadControlsMap() {
    return loadJson("./assets/data/map_ctrls.json")
    .then(function(ctrlsMap) {
        state.set('ctrlsMap', ctrlsMap);
        return ctrlsMap;
    });
}

function loadCharacterList() {
    return loadJson("./assets/data/map_chars.json")
    .then(function(data) {
        let characterData = [];

        for (let h in data) {
            characterData[data[h].i] = {
                c: data[h].c,
                n: data[h].n,
                c_index: data[h].c_index,
                i: data[h].i,
            };
        }

        state.set('characterData', characterData);

        return characterData;
    });
}

function sortCharacterList(characterList) {
    let sortedList = [];

    // This accomodates for characters with leading zeros for IDs
    for (let h in characterList) {
        sortedList[parseInt(h)] = characterList[h];
    }

    return sortedList.sort((characterA, characterB) => {
        return characterA.c_index.localeCompare(characterB.c_index);
    });
}

function loadMoveList(characterIndex) {
    return loadJson("./assets/data/movelists/MOVELIST_" + characterIndex + ".json")
        .then(parseMoveList);
}

function parseMoveList(data) {
    let hitsMap  = state.get('hitsMap');
    let lang     = state.get('lang');
    let ctrlsMap = state.get('ctrlsMap');

    return data.moves.map((move) => {
        return new Move(move, lang, ctrlsMap, hitsMap);
    });
}

function fetchMoveList(characterIndex) {
    return loadMoveList(characterIndex)
    .then(function(moves) {
        state.set('selectedCharacter', characterIndex);
        state.set('currentMoveList', moves);
        state.save();

        let characterList = state.get('characterData');

        View.renderSelectedCharacterName(characterList[characterIndex].n);
        View.renderCharacterList(sortCharacterList(characterList), characterIndex);
        View.renderMoveList(moves, state.get('buttonLayout'));
    }).catch(function(error) {
        console.log("Failed to render movelist", error);
    });
}

function filterMoveList() {
    let filteredMoveList = filters.filterMoveList(state.get('currentMoveList'));

    View.renderMoveList(filteredMoveList, state.get('buttonLayout'));
}

exports.importData        = importData;
exports.toggleCharMenu    = toggleCharMenu;
exports.togglePreferences = togglePreferences;
exports.toggleFilter	  = toggleFilter;
exports.filterMoveList    = filterMoveList;
exports.setLang           = setLang;
exports.changePlatform    = changePlatform;
exports.fetchMoveList     = fetchMoveList;

})(window);