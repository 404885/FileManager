<script lang="ts" setup>
import {onMounted, ref} from "vue";
import BottomBarIcon from "@/components/Icon/BottomBarIcon.vue";
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";
import Sortable from "sortablejs";
import Clock from "@/components/Bar/BottomBar/Clock.vue";
import Volume from "@/components/Bar/BottomBar/Volume.vue";
import Windows from "@/components/Bar/BottomBar/Windows.vue";
import Notification from "@/components/Bar/BottomBar/Notification.vue";

const deskTopStore = useDeskTopCondition()


function toggleWindow(id: string) {
  if (deskTopStore.isMinimized(id)) {
    deskTopStore.restoreWindow(id)
  } else {
    deskTopStore.minimizeWindow(id)
  }
}

const midControls = ref<HTMLDivElement|null>(null)
onMounted(() => {

  if (midControls.value) {
    Sortable.create(midControls.value, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      chosenClass: 'sortable-chosen',
      forceFallback: true, // 必须开这个才能禁止 clone
      onEnd: (evt) => {
        const newOrder = [...deskTopStore.bottomBarOrder]
        const [moved] = newOrder.splice(evt.oldIndex!, 1)
        newOrder.splice(evt.newIndex!, 0, moved)
        deskTopStore.setBottomBarOrder(newOrder)
      },
    })
  }
})
</script>

<template>
  <div id="BottomBar" class="window-bottom-controls">
    <div class="left-controls">
      <Windows/>
    </div>
    <div class="mid-controls" ref="midControls">
      <BottomBarIcon
          v-for="(app) in deskTopStore.getBottomBarApps"
          :key="app.id"
          :data-id="app.id"
          :icon="app.icon"
          :width="'1.5em'"
          :height="'1.5em'"
          @click="toggleWindow(app.id)"
      />
    </div>
    <div class="right-controls">
      <Volume/>
      <Clock/>
      <Notification/>
    </div>
  </div>
</template>

<style scoped>
.sortable-drag {
  opacity: 1 !important;
}

.sortable-chosen {
  background: rgba(255, 255, 255, 0.4);
  opacity: 0.8;
}
.window-bottom-controls {
  display: flex;
  flex-direction: row;
  min-height: 36px;
  background: rgba(230, 230, 230, 0.8);
  box-shadow: inset 0 0 1px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(0, 0, 0, 0.05);
}
.left-controls{
  display: flex;
  flex-direction: row;
}
.mid-controls{
  display: flex;
  flex-direction: row;
}
.right-controls{
  margin-left: auto;
  display: flex;
  flex-direction: row;
}
</style>