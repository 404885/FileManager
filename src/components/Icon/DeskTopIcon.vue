<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue"
import interact from "interactjs"
import { useDeskTopCondition } from "@/pinia/DeskTopCondition.ts"

const props = defineProps({
  icon: { required: true, type: String },
  name: { required: true, type: String },
  id: { required: true, type: String }, // 需要添加 id
  x: {type:Number, required:true},
  y: {type:Number, required:true},
  iconSize:{type:Number},
})

const store = useDeskTopCondition()

const DeskTopIcon = ref<HTMLElement | null>(null)
const gridSize = props.iconSize || 80
const width = props.iconSize || 80
const height = props.iconSize || 80
const position = ref({ x: props.x, y: props.y})
const origin = ref({ x: position.value.x, y: position.value.y })

const isSelected = ref(false)

function onDeskTopIconClick(e: MouseEvent) {
  e.stopPropagation();
  const target = e.target as HTMLElement;
  isSelected.value = DeskTopIcon.value!.contains(target)
}



onMounted(() => {
  const el = DeskTopIcon.value
  if (!el) return

  el.setAttribute('data-x', String(position.value.x))
  el.setAttribute('data-y', String(position.value.y))

  // 初次注册
  store.updateIconBox({
    id: props.id,
    x: position.value.x,
    y: position.value.y,
    width,
    height,
  })

  interact(el).draggable({
    cursorChecker: () => 'default',
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true,
      }),
    ],
    listeners: {
      start() {
        origin.value = { ...position.value }
      },
      move(event) {
        const x = (parseFloat(el.getAttribute('data-x')!) || 0) + event.dx
        const y = (parseFloat(el.getAttribute('data-y')!) || 0) + event.dy
        el.style.transform = `translate(${x}px, ${y}px)`
        el.setAttribute('data-x', String(x))
        el.setAttribute('data-y', String(y))
      },
      end() {
        let x = parseFloat(el.getAttribute('data-x')!) || 0
        let y = parseFloat(el.getAttribute('data-y')!) || 0

        x = Math.round(x / gridSize) * gridSize
        y = Math.round(y / gridSize) * gridSize

        const box = {
          id: props.id,
          x,
          y,
          width,
          height,
        }

        // 碰撞则还原
        if (store.isColliding(box)) {
          x = origin.value.x
          y = origin.value.y
        } else {
          store.updateIconBox(box)
          origin.value = { x, y }
        }

        el.style.transform = `translate(${x}px, ${y}px)`
        el.setAttribute('data-x', String(x))
        el.setAttribute('data-y', String(y))

        position.value.x = x
        position.value.y = y
      },
    },
  })


  // 初始位置
  el.style.transform = `translate(${position.value.x}px, ${position.value.y}px)`


  document.addEventListener('mousedown', onDeskTopIconClick)
})

onBeforeUnmount(()=>{
  document.removeEventListener('mousedown', onDeskTopIconClick)
})

</script>

<template>
  <div class="desktop-icon-wrapper"
       :class="{ selected: isSelected }"
       :style="{width:iconSize+'px',height:iconSize+'px'}"
       ref="DeskTopIcon">
    <svg class="desktop-icon" aria-hidden="true">
      <use :href="'#icon-'+icon" />
    </svg>
    <span class="desktop-icon-name">{{name}}</span>
  </div>
</template>

<style scoped>
.desktop-icon-wrapper {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: default; /* 鼠标悬停时显示手型光标 */
  border: 1px solid transparent; /* 默认透明边框，避免hover时布局跳动 */
  border-radius: 5px; /* 轻微圆角 */
  user-select: none;

  /* 添加平滑过渡效果 */
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.desktop-icon-wrapper:hover{
  background-color: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.desktop-icon-wrapper.selected{
  background-color: rgba(255, 255, 255, 0.55);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.desktop-icon{
  width: 4em;
  height: 4em;
}
.desktop-icon-name{
  text-align: center;
  font-size: 0.7em;
  color: white;
  font-family: "Microsoft YaHei",serif;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.79);
  padding-bottom: 5px;
}

</style>