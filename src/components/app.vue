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

.char-movelist {
    /*width: 600px;*/
    max-width: 970px;
    height: 100%;
    margin-left: 3px;
}

.char-movelist .head {
    margin-left: 25px;
    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;

    @media only screen and (max-width: 800px) {
        align-items: center;
        margin-left: 5px;
    }

    .move-head {
        color: #ffffff;
        font-family: "Trump", Arial, sans-serif;
        font-size: 40px;
        font-style: italic;
        text-transform: uppercase;
        text-shadow: 0 0 6px hsla(0, 100%, 47%, 1);
        margin: 3px 15px 3px 0px;

        @media only screen and (max-width: 800px) {
            font-size: 22px;
        }
    }

    .opt-buttons {
        display: block;
        color: #ffffff;

        .btn-preferences, .btn-filter {
            display: inline-block;
            font-size: 20px;
            font-weight: bold;
            background-color: hsla(193, 77%, 20%, 0.75);
            padding-left: 15px;
            padding-right: 15px;
            margin-right: 5px;
            border-radius: 5px;
            font-family: "Core Sans G", Arial, sans-serif;
            text-transform: uppercase;
            text-shadow: 0 0 6px hsla(181, 92%, 50%, 1);
            cursor: pointer;
            vertical-align: middle;
            height: 25px;
            line-height: 25px;

            @media only screen and (max-height: 800px){
                height: 20px;
                font-size: 15px;
                padding-left: 5px;
                padding-right: 5px;
                margin-right: 5px;
                line-height: 20px;
            }
        }

        *:hover {
            background-color: hsla(193, 76%, 30%, 0.75);
        }

        *:active {
            background-color: hsla(193, 77%, 12%, 0.75);
        }
    }
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

.move-table {
    /*background-color: rgba(0,0,0,0.25);*/
    border: 1px solid hsla(193, 77%, 40%, 0.25);
    margin-top: 2px;
    border-radius: 2px;
    max-width: 100%;
    //width: auto;
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

.move-hitdmg {
    background-color: rgba(0,0,0,0.75);
    border: 1px solid hsla(193, 77%, 20%, 0.75);
    padding: 0px 10px 0 10px;
    margin-left: 10px;
    border-radius: 4px;
    max-width: 100%;
    font-size: 1.5vmin;
    display: none;
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

@media only screen and (max-width: 1130px) {
    .char-movelist {
        max-width: 80vw;
    }
}

@media only screen and (max-width: 801px) {
    .move-head {
        font-size: 35px;
    }

    .char-movelist {
        max-width: 98vw;
    }

    .move-button, .move-arrow {
        width: 30px;
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