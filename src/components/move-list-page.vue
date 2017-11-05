<template>
    <div class="main-container">
        <character-list></character-list>
    	<div class="separator"></div>
    	<move-list></move-list>
	</div>
</template>

<style lang="scss">
.main-container {
    width: 100vw;
    height: calc(100vh - 180px);
    display: flex;
    flex-direction: row;
    align-content: flex-start;
    align-items: center;
    text-align: center;
    position: absolute;
    left: 0;
    top: 100px;

    @media only screen and (max-width: 800px) {
        top: 70px;
    }
}

@media only screen and (max-height: 800px) {
    .main-container {
        height: 80%;
    }
}
</style>

<script>
import CharacterList from './../components/character-list.vue';
import MoveList from './../components/move-list.vue';

export default {
    components: {
        CharacterList,
        MoveList,
    }
};
</script>