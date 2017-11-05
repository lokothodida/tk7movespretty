<template>
    <p :class="getHitLevelClasses(hit)">
        {{ hit.getLevel() }} {{ hit.isThrow() ? "Throw" : "" }}
    </p>
</template>

<style lang="scss">
.mv-hitlvl {
    margin: 0;
    text-transform: uppercase;
    font-weight: bold;
    text-shadow: 0px 0px 5px #000000;
}

.hithigh {
    color:  #ffc6ff;
}

.hitmid {
    color: #ffff79;
}

.hitlow {
    color:  #9cd3fc;
}

.hitsmid {
    color: #00d56d;
}

.hitnoblk {
    color: #0cc;
}
</style>

<script>
export default {
    props: ['hit', 'index'],

    methods: {
        getHitLevelClasses(hit) {
    		return `mv-hitlvl hit${hit.getLevel().toLowerCase()}`;
    	}
    }
};
</script>