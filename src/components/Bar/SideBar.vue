<script lang="ts" setup>



import { IconData } from "@/utils";



const dataTop = IconData.sideTopData

const dataBottom = IconData.sideBottomData

</script>

<template>
  <div class="window-sidebar">
    <div class="sidebar-menu">
      <div class="menu-top">
        <div v-for="item in dataTop">
          <el-popover placement="right" :width="60" trigger="hover" :content = 'item.text' popper-class="popover" :hide-after="0">
            <template #reference>
              <RouterLink v-for="item in dataTop" :to="item.to" class="menu-icon animate_press">
                <Icon  :type="item.icon" source="bar"/>
              </RouterLink>
            </template>
          </el-popover>
        </div>
      </div>
      <div class="menu-bottom">
        <div v-for="item in dataBottom">
          <el-popover placement="right" :width="60" trigger="hover" :content = 'item.text' popper-class="popover" :hide-after="0">
            <template #reference>
              <RouterLink  :to="item.to" class="menu-icon animate_press">
                <Icon  :type="item.icon" source="bar"/>
              </RouterLink>
            </template>
          </el-popover>
        </div>
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