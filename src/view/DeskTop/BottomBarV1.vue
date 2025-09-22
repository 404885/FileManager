<script setup lang="ts">

import BottomBarIcon from "@/components/Icon/BottomBarIcon.vue";
import {useDeskTopCondition} from "@/pinia/DeskTopCondition.ts";
import {onMounted, ref} from "vue";
import Sortable from "sortablejs";
import IconContainer from "@/components/Container/IconContainer.vue";

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

  <div class="window-bottom">
    <div class="window-bottom-pin">
      <IconContainer :link-mode="false" name="folder" size="30"></IconContainer>
      <IconContainer :link-mode="false" name="folder" size="30"></IconContainer>
      <IconContainer :link-mode="false" name="folder" size="30"></IconContainer>
      <IconContainer :link-mode="false" name="folder" size="30"></IconContainer>
      <IconContainer :link-mode="false" name="folder" size="30"></IconContainer>
      <IconContainer :link-mode="false" name="folder" size="30"></IconContainer>
      <IconContainer :link-mode="false" name="folder" size="30"></IconContainer>
      <IconContainer :link-mode="false" name="folder" size="30"></IconContainer>
    </div>
    <div class="window-bottom-divider"></div>
    <div class="window-bottom-active">
      <IconContainer :link-mode="false" name="folder" size="30"></IconContainer>
      <IconContainer :link-mode="false" name="folder" size="30"></IconContainer>
      <IconContainer :link-mode="false" name="folder" size="30"></IconContainer>
      <IconContainer :link-mode="false" name="folder" size="30"></IconContainer>
    </div>
  </div>

</template>

<style scoped>
.direction-bottom {

}
.direction-right {

}
.direction-left {

}



.window-bottom {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);

  margin: 10px;
  padding-left: 10px;
  padding-right: 10px;
  height: 48px;
  width: fit-content;
  min-width: 200px;
  max-width: 90%;


  /* 布局：让内部图标水平排列 */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-direction: row;

  background: rgba(255,255,255, 0.1);
  backdrop-filter: blur(4px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  /* 核心修改：多重阴影实现更高层次感 */
  box-shadow:
      0 8px 15px rgba(0, 0, 0, 0.12),  /* 远处的阴影，收敛但柔和 */
      0 2px 6px rgba(0, 0, 0, 0.2);     /* 近处的阴影，更集中、更清晰 */;
}

.window-bottom-pin {
  width: fit-content;
  display: flex;
  gap: 10px;
}
.window-bottom-active {
  flex: 1;
  display: flex;
  gap: 10px;
}
.window-bottom-divider {
  border: rgba(255, 255, 255, 0.4) solid 1px;
  height: 30px;
}

</style>