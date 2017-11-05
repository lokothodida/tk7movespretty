<template>
    <div>
        <app-header></app-header>
        <app-body></app-body>
        <app-footer></app-footer>
        <preferences-dialog></preferences-dialog>
        <filters-dialog></filters-dialog>
        <video autoplay loop id="video-background" muted plays-inline>
            <source src="./assets/video/background-smoke.mp4" type="video/mp4">
        </video>
    </div>
</template>

<style lang="scss">
/* Style scrollbar in webkit */
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid hsla(193, 77%, 20%, 0.75);
    border-radius: 2px;
}
::-webkit-scrollbar-thumb {
    background-color: hsla(193, 77%, 20%, 0.75);
    border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: hsla(193, 77%, 40%, 0.75);
}

#video-background {
/*  making the video fullscreen  */
    position: fixed;
    right: 0;
    bottom: 0;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    z-index: -100;
    opacity: 0.2;

    @media only screen and (max-width: 800px) {
        display: none;
    }
}


.disable-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.glow {
    -webkit-animation-duration: 1s;
    -webkit-animation-name: glow;
    -webkit-animation-direction: alternate;
    -webkit-animation-iteration-count: infinite;
    animation-duration: 1s;
    animation-name: glow;
    animation-direction: alternate;
    animation-iteration-count: infinite;

}

@-webkit-keyframes glow {
    from { text-shadow: 0 0 5px hsla(181, 92%, 50%, 1); }
    to { text-shadow: 0 0 25px hsla(181, 92%, 50%, 1); }
}

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

.separator {
    background-color: hsla(193, 77%, 40%, 0.5);
    width: 2px;
    height: 100%;
    margin-left: 5px;
    margin-right: 5px;

    @media only screen and (max-width: 800px){
        display: none;
    }
}

table {
    table-layout: fixed;
    width: 100%;
    /*border-collapse: collapse;
    overflow: hidden;*/
}

.move-filter {
    color: #ffffff;
    font-size: 20px;
    font-weight: bold;
    background-color: hsla(193, 77%, 20%, 0.75);
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 5px;
    font-family: "Core Sans G", Arial, sans-serif;
    text-transform: uppercase;
    text-shadow: 0 0 5px hsla(181, 92%, 50%, 1);
    cursor: no-drop;
}

.inner-table {
    overflow-y: scroll;
    overflow-x: hidden;
    height: calc(100% - 60px);
    max-width: 100%;

    @media only screen and (max-width: 800px) {
        height: calc(100% - 30px);
    }

    @media only screen and (max-height: 500px) {
        height: calc(100% - 80px);
    }
}

.move-hint {
    margin: 0;
    margin-right: 5px;
}

.move-framestring, .move-dmgstring, .move-hitdmg,
.move-hitlvlstring, .move-startf, .move-blockf,
.move-hitf, .move-dmg {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.fa-plus-square {
    margin-left: 5px;
    cursor: pointer;
}

.hidden {
    display: none;
}

.fa-chevron-right, .fa-caret-right {
    margin: 0 5px 0 5px;
}

@media only screen and (max-height: 800px){
    .main-container {
        height: 80%;
    }
}
</style>

<script>
import AppHeader from './../components/app-header.vue';
import AppBody from './../components/app-body.vue';
import AppFooter from './../components/app-footer.vue';
import PreferencesDialog from './../components/preferences-dialog.vue';
import FiltersDialog from './../components/filters-dialog.vue';

export default {
    components: {
        AppHeader,
        AppBody,
        AppFooter,
        PreferencesDialog,
        FiltersDialog,
    }
}
</script>