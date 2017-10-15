import * as d3 from 'd3';

/**
 * @param {string} char
 * @return {bool}
 */
export function isLetter(char) {
	return char.toLowerCase() != char.toUpperCase();
}

/**
 * Promise wrapper around d3.json
 * @param {string} path
 * @return {Promise}
 */
export function loadJson(path) {
	return new Promise(function(resolve, reject) {
		d3.json(path, function(error, response) {
			if (error) {
				reject(error);
			}

			resolve(response);
		});
	});
}