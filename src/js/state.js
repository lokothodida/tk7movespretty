import * as d3 from 'd3';
import Cookies from 'cookies';

export default class State {
    constructor() {
        this._properties = {
            characterData : [],
        	ctrlsMap : null,
        	hitsMap : [],
            selectedCharacter : "32",
        	currentMoveList : null,
        	lang : 1,
        	langIndex : 0,
        	jap : false,
        	showPrefDialog : false,
        	showFilterDialog : false,
        	showCharMenuDialog : false,
        	buttonLayouts : ["STEAM", "PS4","XBOX"],
        	buttonLayoutChoice : 2,
        };
    }

    get(property) {
        return this._properties[property];
    }

    set(property, value) {
        this._properties[property] = value;
    }

    save() {
        Cookies.set('tk7moves', JSON.stringify({
    		selected_char: this.get('selectedCharacter'),
    		lang: this.get('lang'),
    		lang_index: this.get('langIndex'),
    		jap: this.get('jap'),
    		bl_choice: this.get('buttonLayoutChoice')
    	}), { expires: 30, path: '' });
    }

    load() {
    	if (typeof Cookies.get('tk7moves') != 'undefined') {
    	    let buttonLayoutChoice = this.get('buttonLayoutChoice');
    	    let langIndex = this.get('langIndex');

    		d3.select("#platf-select > option:nth-child("+(buttonLayoutChoice+1)+")").attr("selected",false);
    		d3.select("#lang-select > option:nth-child("+(langIndex+1)+")").attr("selected",false);

    		var vals = JSON.parse(Cookies.get('tk7moves'));
    		this.set('selectedCharacter', vals.selected_char);
    		this.set('lang', vals.lang);
    		this.set('langIndex', vals.lang_index);
    		this.set('jap', vals.jap);
    		this.set('buttonLayoutChoice', vals.bl_choice);

    		d3.select("#platf-select > option:nth-child("+(buttonLayoutChoice+1)+")").attr("selected",true);
    		d3.select("#lang-select > option:nth-child("+(langIndex+1)+")").attr("selected",true);
    	} else {
    		this.save();
    	}
    }
}