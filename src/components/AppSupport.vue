<script>
import BlockFaq from './BlockFaq.vue';
import BlockCenter from './BlockCenter.vue';
export default {
    data(){
        return{
            page:true,
            pre:'<',
            next:'>',
        }
    },
    methods:{
        
    },
     components:{
         BlockFaq,
         BlockCenter,
         }
}
</script>

<template>
    <div class="wrapper">
        <h2>{{$t('supportCenter')}}</h2>
        <div class="btn-cont">
            <button @click="this.page=true" class="page" :class="{active: this.page === true}">{{$t('information')}}</button>
            <button @click="this.page=false" class="page" :class="{active: this.page === false}" >FAQ</button>
        </div>
        <BlockCenter v-if="page"/>
        <BlockFaq v-else/>
        
    </div>
</template>

<style scoped>
    .wrapper {
  padding: 20px;
}
.btn-cont{
    display:flex;
    gap:20px;
    padding-top:20px;
}
.page{
    padding:15px 24px 15px 24px;
    color:grey;
}
.active{
    color: #CF0032;
    border-radius:8px;
    background-color: rgba(207, 0, 50, 0.1);
}

</style>