<template>
    <div class="footer disable-select">
		<p>
		    <a href="https://github.com/mspkvp/tk7movespretty" target="_blank" style="text-decoration:none;color:#ffffff;">
		        <i class="fa fa-github" aria-hidden="true"></i> mspkvp
	        </a>
	        <span v-html="year"></span> |
	        <span v-html="gui"></span> |
	        <span v-html="copyright"></span>
        </p>
	</div>
</template>

<style lang="scss">

.footer {
    width: 100%;
    background-color: #013a51;
    height: 35px;
    position: absolute;
    left: 0px;
    bottom: 15px;
    line-height: 30px;

    @media only screen and (max-height: 800px) {
        font-size: 12px;
        line-height: 20px;
        height: 25px;
        overflow-y: hidden;
    }

    p {
        color: #ffffff;
        font-family: "Core Sans G", Arial, sans-serif;
        overflow-x: auto;
        white-space: nowrap;
        margin: 0;
        margin-left: 15px;
        margin-right: 15px;
        margin-top: 3px;

        @media only screen and (max-height: 800px) {
            //font-size: 15px;
            overflow-y: hidden;
        }
    }
}

.footer p::-webkit-scrollbar {
    height: 0px !important;
}
</style>

<script>
export default {
    data() {
        return {
            year: '&copy;2017',
            gui: "Fanmade & based on TEKKEN&trade;7's GUI",
            copyright: 'All game images are under TEKKEN&trade;7 & &copy;2017 BANDAI NAMCO Entertainment, Inc. copyright protection.',
        }
    }
};
</script>