<script setup lang="ts">
import {onMounted, ref} from "vue";
import Peer, {DataConnection, PeerError} from "peerjs";
import ViewContainerV2 from "@/components/Container/ViewContainerV2.vue";

const emit = defineEmits(['close'])
const props = defineProps<{
  title: string,
}>()


const show = ref(true);

const peer = ref()

const init = ()=>{
  peer.value = new Peer()
  peer.value.on("open",()=>{
    console.log("open",peer.value.id);
  })
  peer.value.on('connection',(Connection:DataConnection)=> {
    Connection.on('open', () => {
      console.log('fileConnection with '+Connection.peer+' has built')
    })
    Connection.on('data', (Data) => {
      console.log('receive data '+Data)
    })
    Connection.on('close', () => {
      console.log('Connection with '+Connection.peer+' has been closed');
    });
  })
  peer.value.on('error',(error:PeerError<any>)=>{
    console.error(error);

  })
}

const PeerId = ref('')

const connect = ()=>{
  peer.value.connect(PeerId.value)
}

onMounted(()=>{
  init()
})

</script>

<template>
  <teleport to="#window-view" v-if="show">
    <ViewContainerV2 :title="props.title" @close="show = false">
      <div class="control">
        <p>
          <el-input v-model="PeerId" style="width: 240px" placeholder="连接对象ID" clearable/>
          <el-button type="primary" @click="connect" >连接对象ID</el-button>
        </p>
        <p>
          <el-input style="width: 240px" placeholder="发送信息" clearable/>
          <el-button type="primary" >发送消息</el-button>
        </p>
      </div>
    </ViewContainerV2>
  </teleport>
</template>

<style scoped>

</style>