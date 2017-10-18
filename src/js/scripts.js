/*!
 * =============================
 * =	Mike Pinto             =
 * =	mspkvp@github.com      =
 * =	©2017 tk7movespretty   =
 * ============================= */
import * as View from './view.js';
import * as filters from './filters.js';
import { loadJson } from './utils.js';
import State from './state.js';
import Character from './character.js';
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
    toggleDialog('#preferences', 'showPrefDialog');
}

function toggleFilter() {
    toggleDialog('#filter', 'showFilterDialog');
}

function toggleDialog(selector, stateProperty) {
    let value = state.get(stateProperty);

    if (value) {
        showDialog(selector);
    } else {
        hideDialog(selector);
    }

    state.set(stateProperty, !value);
}

function showDialog(selector) {
    document.querySelector(selector).style.visibility = 'hidden';
}

function hideDialog(selector) {
    document.querySelector(selector).style.visibility = 'visible';
}

function toggleCharMenu() {
    let showCharMenuDialog = state.get('showCharMenuDialog');

    if (showCharMenuDialog) {
        document.querySelector('#charmenu').style.display = 'none';
    } else {
        document.querySelector('#charmenu').style.display = 'initial';
    }

    state.set('showCharMenuDialog', !showCharMenuDialog);
}

function importData() {
    state.load();

    loadHitsMap()
    .then(() => loadControlsMap())
    .then(() => loadCharacterList())
    .then(() => fetchMoveList(state.get('selectedCharacter')));
}

function loadHitsMap() {
    return loadJson("./assets/data/map_hits.json")
    .then((data) => {
        let hitsMap = {};

        for (var h in data) {
            hitsMap[data[h].i] = data[h].h;
        }

        state.set('hitsMap', hitsMap);

        return hitsMap;
    });
}

function loadControlsMap() {
    return loadJson("./assets/data/map_ctrls.json")
    .then((ctrlsMap) => {
        state.set('ctrlsMap', ctrlsMap);
        return ctrlsMap;
    });
}

function loadCharacterList() {
    return loadJson("./assets/data/map_chars.json")
    .then((data) => {
        let characterData = [];

        for (let h in data) {
            let character = data[h];
            characterData[character.i] = new Character(character);
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
        return characterA.getIndex().localeCompare(characterB.getIndex());
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
    .then((moves) => {
        state.set('selectedCharacter', characterIndex);
        state.set('currentMoveList', moves);
        state.save();

        let characterList = state.get('characterData');
        let character     = characterList[characterIndex];

        View.renderSelectedCharacterName(character.getFullName());
        View.renderCharacterList(sortCharacterList(characterList), characterIndex);
        View.renderMoveList(moves, state.get('buttonLayout'));
    }).catch((error) => {
        console.log(
            `Failed to render movelist for character ${characterIndex}`,
            error
        );
    });
}

function filterMoveList() {
    let filteredMoveList = filters.filterMoveList(state.get('currentMoveList'));

    View.renderMoveList(filteredMoveList, state.get('buttonLayout'));
}

function showHitDamage(moveId) {
    let hitDamage = document.querySelector(`#dmgmove${moveId} + div.move-hitdmg`);

    hitDamage.style.display = 'initial';
}

function hideHitDamage(moveId) {
    let hitDamage = document.querySelector(`#dmgmove${moveId} + div.move-hitdmg`);

    setTimeout(() => hitDamage.style.display = 'none', 3000);
}

exports.importData        = importData;
exports.toggleCharMenu    = toggleCharMenu;
exports.togglePreferences = togglePreferences;
exports.toggleFilter	  = toggleFilter;
exports.filterMoveList    = filterMoveList;
exports.setLang           = setLang;
exports.changePlatform    = changePlatform;
exports.fetchMoveList     = fetchMoveList;
exports.showHitDamage     = showHitDamage;
exports.hideHitDamage     = hideHitDamage;

})(window);