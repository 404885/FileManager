import type { DirectiveBinding } from 'vue';



interface DragOptions {
    handle?: string; // 可选：指定拖动手柄的 CSS 选择器
    initialCenter?: boolean; // 可选：是否在挂载时居中元素
    exclude?: string; // 可选：指定拖动手柄内部不触发拖拽的子元素 CSS 选择器
}

// 扩展 HTMLElement 类型，用于存储指令的内部状态
interface DragHTMLElement extends HTMLElement {
    _onDragDestroy?: () => void; // 清理事件监听的函数
    _dragInitialX?: number; // 拖拽开始时元素的初始 X 偏移量 (最终应用到transform的值，即已除以DPR)
    _dragInitialY?: number; // 拖拽开始时元素的初始 Y 偏移量 (最终应用到transform的值，即已除以DPR)
    _animationFrameId?: number; // requestAnimationFrame 的 ID
    _lastRenderedX?: number; // 上次渲染的 X 坐标 (最终应用到transform的值，即已除以DPR)
    _lastRenderedY?: number; // 上次渲染的 Y 坐标 (最终应用到transform的值，即已除以DPR)
}

export const vDrag = {
    mounted(el: HTMLElement, binding: DirectiveBinding<DragOptions>) {
        const options = binding.value || {};
        const dpr = window.devicePixelRatio || 1; // 获取设备像素比

        // 检查元素定位：非 static 是 transform 拖拽的基础
        if (getComputedStyle(el).position === 'static') {
            console.warn('[v-drag] 可拖拽元素应具有非 static 的定位 (如 "absolute" 或 "fixed")，以确保拖拽功能正常。');
        }

        // 确定拖动手柄元素
        // 如果指定了 handle 且找到了，就用它；否则用 el 自身作为手柄
        const handleEl = options.handle
            ? (el.querySelector(options.handle) as HTMLElement)
            : el;

        if (!handleEl) {
            console.warn(`[v-drag] 未找到拖动手柄元素，选择器为 "${options.handle}"。`);
            return; // 找不到手柄则直接返回，不继续绑定事件
        }

        let isDragging = false;
        let startMouseX = 0; // 鼠标按下时的 X 坐标 (CSS 像素)
        let startMouseY = 0; // 鼠标按下时的 Y 坐标 (CSS 像素)

        // 辅助函数：从元素的 transform 样式中提取当前的 translate 偏移量
        const getTransformOffsets = (element: HTMLElement) => {
            const transform = element.style.transform;
            const match = transform.match(/translate(?:3d)?\(([-.\d]+)px,\s*([-.\d]+)px(?:,\s*[-.\d]+px)?\)/);
            if (match) {
                return {
                    x: parseFloat(match[1]),
                    y: parseFloat(match[2]),
                };
            }
            return { x: 0, y: 0 };
        };

        // 获取元素当前的实际渲染位置（getBoundingClientRect 返回的是 CSS 像素值）
        const currentRect = el.getBoundingClientRect();
        // 获取定位父元素的矩形信息，如果不存在则视为 (0,0)
        const parentRect = el.offsetParent ? el.offsetParent.getBoundingClientRect() : { left: 0, top: 0 };

        // 计算元素相对于其定位父元素的初始偏移量（这是 CSS 像素距离）
        const initialCssX = currentRect.left - parentRect.left;
        const initialCssY = currentRect.top - parentRect.top;

        // 将 CSS 像素转换为“物理像素概念”并存储初始位置
        (el as DragHTMLElement)._lastRenderedX = Math.round(initialCssX * dpr) / dpr;
        (el as DragHTMLElement)._lastRenderedY = Math.round(initialCssY * dpr) / dpr;

        // 处理初始居中选项
        if (options.initialCenter) {
            const parentEl = el.parentElement; // 通常是定位父元素，但不总是
            if (parentEl) {
                const pRect = parentEl.getBoundingClientRect();
                const eRect = el.getBoundingClientRect();

                const centerX_css = (pRect.width - eRect.width) / 2;
                const centerY_css = (pRect.height - eRect.height) / 2;

                const initialX_transformed = Math.round(centerX_css * dpr) / dpr;
                const initialY_transformed = Math.round(centerY_css * dpr) / dpr;

                el.style.transform = `translate(${initialX_transformed}px, ${initialY_transformed}px)`;
                (el as DragHTMLElement)._lastRenderedX = initialX_transformed;
                (el as DragHTMLElement)._lastRenderedY = initialY_transformed;
            }
        }

        // --- 事件处理函数 ---

        const onMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // **核心修改：防止拖拽被某些子元素触发**
            // 1. 如果定义了 exclude 选择器，并且点击的目标或其父级匹配该选择器，则不触发拖拽。
            if (options.exclude && target.closest(options.exclude)) {
                return;
            }

            // 2. （可选但推荐）默认阻止一些常见的交互元素触发拖拽，除非它们被明确设置为 handle
            // 确保这些元素不是 handleEl 本身。
            if (target !== handleEl && (target.matches('button, input, a, textarea, select') || target.closest('button, input, a, textarea, select'))) {
                // 如果点击的是非手柄的交互元素，也不触发拖拽
                return;
            }


            e.preventDefault(); // 阻止默认的浏览器拖拽行为（如图片拖拽或文本选择）
            isDragging = true;
            startMouseX = e.clientX; // 鼠标事件的 clientX/Y 是 CSS 像素
            startMouseY = e.clientY;

            // 拖拽开始时，获取元素当前实际应用在 transform 上的位置
            const { x, y } = getTransformOffsets(el);
            (el as DragHTMLElement)._dragInitialX = x;
            (el as DragHTMLElement)._dragInitialY = y;

            // 拖拽开始时，禁用手柄元素及其内部元素的 pointer-events，防止点击被拦截
            disablePointerEvents();

            // 添加全局事件监听器，确保鼠标移出元素也能继续拖拽
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            el.classList.add('is-dragging');
            handleEl.style.cursor = 'grabbing'; // 改变手柄光标
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            // 如果已经有动画帧在等待，取消它以确保只在最新的位置更新
            if ((el as DragHTMLElement)._animationFrameId) {
                cancelAnimationFrame((el as DragHTMLElement)._animationFrameId!);
            }

            const deltaX_css = e.clientX - startMouseX;
            const deltaY_css = e.clientY - startMouseY;

            // 基于物理像素进行计算，避免浮点数累积误差
            const currentPhysicalX = ((el as DragHTMLElement)._dragInitialX || 0) * dpr;
            const currentPhysicalY = ((el as DragHTMLElement)._dragInitialY || 0) * dpr;

            const newPhysicalTargetX = Math.round(currentPhysicalX + (deltaX_css * dpr));
            const newPhysicalTargetY = Math.round(currentPhysicalY + (deltaY_css * dpr));

            let targetX = newPhysicalTargetX / dpr;
            let targetY = newPhysicalTargetY / dpr;

            // 优化：只有当目标位置实际发生变化时才请求动画帧更新
            if (targetX === (el as DragHTMLElement)._lastRenderedX && targetY === (el as DragHTMLElement)._lastRenderedY) {
                return;
            }

            (el as DragHTMLElement)._animationFrameId = requestAnimationFrame(() => {
                el.style.transform = `translate(${targetX}px, ${targetY}px)`;
                (el as DragHTMLElement)._lastRenderedX = targetX;
                (el as DragHTMLElement)._lastRenderedY = targetY;
            });
        };

        const onMouseUp = () => {
            isDragging = false;

            // 确保任何待处理的动画帧被取消
            if ((el as DragHTMLElement)._animationFrameId) {
                cancelAnimationFrame((el as DragHTMLElement)._animationFrameId!);
                (el as DragHTMLElement)._animationFrameId = undefined;
            }

            // 确保元素停留在最终的计算位置
            const { x, y } = getTransformOffsets(el);
            el.style.transform = `translate(${x}px, ${y}px)`;
            (el as DragHTMLElement)._lastRenderedX = x;
            (el as DragHTMLElement)._lastRenderedY = y;

            // 拖拽结束后恢复 pointer-events
            enablePointerEvents();

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            el.classList.remove('is-dragging');
            handleEl.style.cursor = 'grab'; // 恢复手柄光标
        };

        // **关键更改：动态应用 pointer-events 到实际的 handleEl**
        const disablePointerEvents = () => {
            // 确保 handleEl 存在才操作
            if (handleEl) {
                handleEl.style.pointerEvents = 'none'; // 禁用手柄的 pointer-events
            }
        };

        const enablePointerEvents = () => {
            // 确保 handleEl 存在才操作
            if (handleEl) {
                handleEl.style.pointerEvents = 'auto'; // 恢复手柄的 pointer-events
            }
        };

        // --- 绑定事件和性能优化 ---
        // 将 mousedown 事件监听器绑定到 handleEl
        handleEl.addEventListener('mousedown', onMouseDown);

        // 提示浏览器 transform 属性会频繁变化，进行性能优化
        el.style.willChange = 'transform';
        // 应用初始的 transform 样式
        el.style.transform = `translate(${(el as DragHTMLElement)._lastRenderedX || 0}px, ${(el as DragHTMLElement)._lastRenderedY || 0}px)`;


        // 存储清理函数，以便在组件卸载时调用
        (el as DragHTMLElement)._onDragDestroy = () => {
            handleEl.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            el.style.removeProperty('will-change');
            el.classList.remove('is-dragging');
            handleEl.style.cursor = 'grab';
        };
    },

    unmounted(el: HTMLElement) {
        // 在组件卸载时调用清理函数
        (el as DragHTMLElement)._onDragDestroy?.();
        // 如果有未完成的动画帧，也要取消
        if ((el as DragHTMLElement)._animationFrameId) {
            cancelAnimationFrame((el as DragHTMLElement)._animationFrameId!);
        }
    }
}
