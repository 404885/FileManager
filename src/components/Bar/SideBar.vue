<script lang="ts" setup>


import Icon from "@/components/Icon.vue";
import { IconData } from "@/utils";

const dataTop = IconData.sideTopData

const dataBottom = IconData.sideBottomData

</script>

<template>
  <div class="window-sidebar">
    <div class="sidebar-menu">
      <div class="menu-top">
        <RouterLink v-for="item in dataTop" :to="item.to" class="menu-icon animate_press">
          <Icon :type="item.icon" source="bar"/>
        </RouterLink>
      </div>
      <div class="menu-bottom">
        <RouterLink v-for="item in dataBottom" :to="item.to" class="menu-icon animate_press">
          <Icon :type="item.icon" source="bar"/>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== side-bar ========== */
.window-sidebar{
  display: flex;
  flex-direction: row;
}
.sidebar-menu {
  display: flex;
  flex-direction: column;
  width: 42px;
  justify-content: space-between;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 6px;
}
.menu-top, .menu-bottom {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}


.menu-icon {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon svg {
  width: 24px;
  height: 24px;
  pointer-events: none;
}

</style>