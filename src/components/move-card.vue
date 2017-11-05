<template>
    <td class="move-card">
        <div class="move-info">
            <div class="move-number">{{ move.getNumber() }}</div>
            <div class="move-title">
                <div class="move-name">{{ move.getName() }}</div>
                <div class="move-hitamount">
                	{{ move.getTotalHits() }} {{ move.getHits().length == 1 ? " Hit" : " Hits" }}
            	</div>
            </div>
            <div class="move-string">
            	<template v-for="command in move.getCommands()">
            		<span v-if="command.hasLetter()" class="move-hint">{{ command.getSymbol() || '' }}</span>
            		<template v-else v-for="input in command.getInputs()">
            			<img v-if="input.isMovement() && input.isHeld() && !input.isNeutral()" class="move-arrow" :src="getHeldDirectionalImage(input)">

            			<img v-else-if="input.isMovement() || input.isNeutral()" class="move-arrow" :src="getDirectionalImage(input)">

            			<img v-else-if="input.isAttack()" class="move-button" :src="getAttackButtonImage(input)">

            			<p v-else-if="input.getSymbol() === '>'" class="move-hint" style="color:#37ff05;font-size:20px;">
			                <i class="fa fa-chevron-right" aria-hidden="true"></i>
			            </p>

			            <p v-else class="move-hint">{{ input.getSymbol() }}</p>
            		</template>
            	</template>
            </div>
            <div class="move-hit-dmg">
                <div class="move-hitlvlstring">
                	<template v-for="(hit, index) in move.getHits()">
                		<move-hit-level :key="index" :hit="hit" :index="index"></move-hit-level>
        				<i v-if="index < move.getHits().length - 1" class="fa fa-chevron-right" aria-hidden="true"></i>
            		</template>

                	<template v-if="move.hasThrow()">
	                	<i class="fa fa-caret-right" aria-hidden="true"></i>
					    <p class="mv-hitlvl">
					        {{ move.getThrowBreakFrames() }}F BREAK {{ move.getThrowBreak() }}
					    </p>
				    </template>
                </div>
                <move-damage :move="move"></move-damage>
            </div>
        </div>
        <move-extra :move="move"></move-extra>
    </td>
</template>

<style lang="scss">
.move-card {
    color:  #ffffff;
    font-family: "Core Sans G", Arial, sans-serif;
    border: 2px solid hsla(193, 77%, 20%, 0.75);
    background-color: rgba(0,0,0,0.50);
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    border-radius: 1px;
    max-width: 100%;
    justify-content: space-between;
}

.move-button, .move-arrow {
    width: 40px;
    height: auto;
    padding: 1px;
}

.move-info {
    position: relative;
    max-width: 760px;

    @media only screen and (max-width: 1130px) {
        max-width: calc(100vw - 400px);
    }

    @media only screen and (max-width: 800px) {
        max-width: calc(100vw - 135px);
    }
}

.move-title * {
    @media only screen and (max-width: 800px) {
        font-size: 14px !important;
    }
}

.move-number {
    position: absolute;
    width: 40px;
    height: 25px;
    background-color: hsla(193, 77%, 20%, 0.75);
    left: 0;
    top: 0;
    margin-left: -1px;
    margin-top: -1px;
    border-bottom-right-radius: 20px;
    font-size: 15px;
    text-indent: -5px;

    @media only screen and (max-width: 800px) {
        font-size: 10px;
        width: 25px;
        height: 15px;
    }
}

.move-string {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 50px;
    max-width: 100%;
    overflow-x: auto;
    cursor: grab;

    @media only screen and (max-width: 800px) {
        margin-left: 25px;
        font-size: 12px;
    }
}

div.move-string::-webkit-scrollbar {
    height: 3px !important;
}
.move-name {
    font-size: 20px;
    font-weight: bold;
    margin-left: 50px;
    margin-right: 10px;
    padding-top: 5px;

    @media only screen and (max-width: 800px) {
        margin-left: 25px;
        margin-right: 5px;
    }
}

.move-hitlvlstring {
    margin: 3px 0 5px 50px;
    overflow-x: auto;
    overflow-y: hidden;

    @media only screen and (max-width: 800px) {
        margin-left: 25px;
    }
}

div.move-hitlvlstring::-webkit-scrollbar {
    height: 3px !important;
}

.move-hitamount {
    text-align: left;
    color: #f19700;
    font-weight: bold;
    text-shadow: 0px 0px 5px #000000;
    font-style: italic;
    font-size: 18px;
}

@media only screen and (max-width: 801px) {
    .move-button, .move-arrow {
        width: 30px;
    }
}

.move-hit-dmg * {
    @media only screen and (max-width: 800px) {
        font-size: 12px;
    }
}

.move-title, .move-hit-dmg {
    display: flex;
    flex-direction: row;
    align-items: baseline;
}
</style>

<script>
import MoveHitLevel from './move-hit-level.vue';
import MoveDamage from './move-damage.vue';
import MoveExtra from './move-extra.vue';

export default {
    props: ['move'],

    methods: {
    	getHeldDirectionalImage(input) {
    		return `./assets/arrow/${input.getSymbol().toLowerCase()}p.svg`;
    	},

    	getDirectionalImage(input) {
    		return `./assets/arrow/${input.getSymbol().toLowerCase()}.svg`;
    	},

    	getAttackButtonImage(input) {
    		return `./assets/button/${this.buttonLayout}/${input.getSymbol()}.svg`;
    	},
    },

    computed: {
    	buttonLayout() {
    		return this.$store.state.preferences.buttonLayout;
    	}
    },

    components: {
    	MoveHitLevel,
    	MoveDamage,
    	MoveExtra,
    }
};
</script>