import { getMoveString } from './move.js';

/**
 * @param {object[]} currentMoveList
 * @param {bool} jap
 */
export function filterMoveList(currentMoveList, jap, lang, ctrlsMap) {
	let filters  = getFilters();

	return currentMoveList.filter(function(move) {
		let moveString  = getMoveString(move, lang, ctrlsMap);
		let includeMove = true;

		if (filters.moveName) {
			includeMove = includeMove && move.name[jap ? 0 : 1].toLowerCase().match(filters.moveName.toLowerCase());
		}

		if (filters.moveString) {
			includeMove = includeMove && moveString.match(filters.moveString);
		}

		if (filters.specialProperties.spin) {
			includeMove = includeMove && move.b9;
		}

		if (filters.specialProperties.armor) {
			includeMove = includeMove && move.b8;
		}

		if (filters.specialProperties.track) {
			includeMove = includeMove && move.bB;
		}

		if (!isNaN(filters.frameProperties.start.value)) {
			includeMove = includeMove && compare(
				move.s,
				filters.frameProperties.start.value,
				filters.frameProperties.start.comparison
			);
		}

		if (!isNaN(filters.frameProperties.block.value)) {
			includeMove = includeMove && compare(
				move.blk,
				filters.frameProperties.block.value,
				filters.frameProperties.block.comparison
			);
		}

		if (!isNaN(filters.frameProperties.hit.value)) {
			includeMove = includeMove && compare(
				move.adv,
				filters.frameProperties.hit.value,
				filters.frameProperties.hit.comparison
			);
		}

		return includeMove;
	});
}

// impure - document
function getFilters() {
	let moveName = document.querySelector('#move-name-filter').value;
	let moveString = document.querySelector('#move-string-filter').value;
	let specialProperties = {
		spin: document.querySelector('#move-property-spin-filter').checked,
		track: document.querySelector('#move-property-track-filter').checked,
		armor: document.querySelector('#move-property-armor-filter').checked,
	};

	let frameProperties = {
		start: {
			value: document.querySelector('#frame-property-start-filter').value,
			comparison: document.querySelector('#frame-property-start-comparison-filter').value,
		},
		block: {
			value: document.querySelector('#frame-property-block-filter').value,
			comparison: document.querySelector('#frame-property-block-comparison-filter').value,
		},
		hit: {
			value: document.querySelector('#frame-property-hit-filter').value,
			comparison: document.querySelector('#frame-property-hit-comparison-filter').value,
		}
	};

	frameProperties.start.value = parseInt(frameProperties.start.value);
	frameProperties.block.value = parseInt(frameProperties.block.value);
	frameProperties.hit.value = parseInt(frameProperties.hit.value);

	return {
		moveName: moveName,
		moveString: moveString,
		specialProperties: specialProperties,
		frameProperties: frameProperties,
	};
}

function compare(value1, value2, operator) {
	switch (operator) {
		case '<=':
			return value1 <= value2;
		case '<':
			return value1 < value2;
		case '>=':
			return value1 >= value2;
		case '>':
			return value1 > value2;
		default:
			return value1 == value2;
	}
}
