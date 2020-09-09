<template>
   <div>
      薪资单
       <div class="top-label"></div>
   </div>
</template>
<script>
    import {mapState} from "vuex"
    export default {
        data() {
            return {
            };
        },
        methods: {
        },
        computed:{
            ...mapState(["account"]),
        },
        mounted() {

        }
    };
</script>
<style scoped>
    .top-label{

    }
</style>