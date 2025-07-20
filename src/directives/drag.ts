// directives/v-drag.ts
import type { DirectiveBinding } from 'vue';

interface DragOptions {
    handle?: string; // 可选：指定拖动手柄的 CSS 选择器
    initialCenter?: boolean; // 可选：是否在挂载时居中元素
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

const drag = {
    // 指令钩子：当绑定元素插入 DOM 时调用
    mounted(el: HTMLElement, binding: Directive<DragOptions>) {
        const options = binding.value || {};
        const dpr = window.devicePixelRatio || 1; // 获取设备像素比

        // 检查元素定位：非 static 是 transform 拖拽的基础
        if (getComputedStyle(el).position === 'static') {
            console.warn('[v-drag] 可拖拽元素应具有非 static 的定位 (如 "absolute" 或 "fixed")，以确保拖拽功能正常。');
        }

        // 确定拖动手柄元素
        const handleEl = options.handle
            ? (el.querySelector(options.handle) as HTMLElement)
            : el;

        if (!handleEl) {
            console.warn(`[v-drag] 未找到拖动手柄元素，选择器为 "${options.handle}"。`);
            return;
        }

        let isDragging = false;
        let startMouseX = 0; // 鼠标按下时的 X 坐标 (CSS 像素)
        let startMouseY = 0; // 鼠标按下时的 Y 坐标 (CSS 像素)

        // 辅助函数：从元素的 transform 样式中提取当前的 translate 偏移量
        // 这里提取出的值已经是应用在transform上的CSS像素值（可能已除以DPR）
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
        const parentRect = el.offsetParent ? el.offsetParent.getBoundingClientRect() : { left: 0, top: 0 };

        // 计算元素相对于其定位父元素的初始偏移量（这是 CSS 像素距离）
        const initialCssX = currentRect.left - parentRect.left;
        const initialCssY = currentRect.top - parentRect.top;

        // 应用你的逻辑：将 CSS 像素转换为“物理像素概念”，取整，再除以 DPR
        // 从而得到最终应用到 transform 上的 CSS 像素值
        (el as DragHTMLElement)._lastRenderedX = Math.round(initialCssX * dpr) / dpr;
        (el as DragHTMLElement)._lastRenderedY = Math.round(initialCssY * dpr) / dpr;


        // 处理初始居中选项
        if (options.initialCenter) {
            const parentEl = el.parentElement;
            if (parentEl) {
                const pRect = parentEl.getBoundingClientRect();
                const eRect = el.getBoundingClientRect();

                const centerX_css = (pRect.width - eRect.width) / 2;
                const centerY_css = (pRect.height - eRect.height) / 2;

                // 按照你的逻辑：先将 CSS 像素转换为“物理像素概念”，取整，再除以 DPR
                const initialX_transformed = Math.round(centerX_css * dpr) / dpr;
                const initialY_transformed = Math.round(centerY_css * dpr) / dpr;

                el.style.transform = `translate(${initialX_transformed}px, ${initialY_transformed}px)`;
                (el as DragHTMLElement)._lastRenderedX = initialX_transformed;
                (el as DragHTMLElement)._lastRenderedY = initialY_transformed;
            }
        }

        // --- 事件处理函数 ---

        const onMouseDown = (e: MouseEvent) => {
            e.preventDefault(); // 阻止默认的浏览器拖拽行为（如图片拖拽）
            isDragging = true;
            startMouseX = e.clientX; // 鼠标事件的 clientX/Y 是 CSS 像素
            startMouseY = e.clientY;

            // 拖拽开始时，获取元素当前实际应用在 transform 上的位置
            // 这个值就是已经过“先取整再除以DPR”处理的逻辑CSS像素值
            const { x, y } = getTransformOffsets(el);
            (el as DragHTMLElement)._dragInitialX = x;
            (el as DragHTMLElement)._dragInitialY = y;

            // 添加全局事件监听器，确保鼠标移出元素也能继续拖拽
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            // 优化：拖拽时添加一个 CSS 类，可以用于改变样式（如移除阴影、模糊等）
            el.classList.add('is-dragging');
            handleEl.style.cursor = 'grabbing'; // 改变手柄光标
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            // 取消任何待处理的 requestAnimationFrame，确保只渲染最新位置
            if ((el as DragHTMLElement)._animationFrameId) {
                cancelAnimationFrame((el as DragHTMLElement)._animationFrameId!);
            }

            // 计算鼠标在 CSS 像素下的移动距离
            const deltaX_css = e.clientX - startMouseX;
            const deltaY_css = e.clientY - startMouseY;

            // 关键逻辑：
            // 1. 将上一个渲染的逻辑 CSS 像素位置 (_dragInitialX/_dragInitialY) 乘以 DPR，
            //    转换为“物理像素概念”上的值。
            // 2. 将鼠标的 CSS 像素移动距离 (deltaX_css/deltaY_css) 也乘以 DPR，
            //    转换为“物理像素概念”上的移动距离。
            // 3. 将这两个“物理像素概念”上的值相加，得到一个新的“物理像素概念”上的目标位置。
            // 4. 对这个“物理像素概念”上的目标位置进行 Math.round() 取整。
            // 5. 最后，将取整后的“物理像素概念”值再除以 DPR，转换回最终要应用到 `transform` 的 CSS 像素值。

            const currentPhysicalX = ((el as DragHTMLElement)._dragInitialX || 0) * dpr;
            const currentPhysicalY = ((el as DragHTMLElement)._dragInitialY || 0) * dpr;

            const newPhysicalTargetX = Math.round(currentPhysicalX + (deltaX_css * dpr));
            const newPhysicalTargetY = Math.round(currentPhysicalY + (deltaY_css * dpr));

            let targetX = newPhysicalTargetX / dpr;
            let targetY = newPhysicalTargetY / dpr;

            // 避免不必要的 DOM 更新：如果位置没有变化，就不更新
            // 注意这里比较的是除以 DPR 后的浮点数
            if (targetX === (el as DragHTMLElement)._lastRenderedX && targetY === (el as DragHTMLElement)._lastRenderedY) {
                return;
            }

            // 请求动画帧来更新元素的 transform
            (el as DragHTMLElement)._animationFrameId = requestAnimationFrame(() => {
                el.style.transform = `translate(${targetX}px, ${targetY}px)`;
                (el as DragHTMLElement)._lastRenderedX = targetX; // 记录已渲染的位置
                (el as DragHTMLElement)._lastRenderedY = targetY;
            });
        };

        const onMouseUp = () => {
            isDragging = false;
            // 清除任何待处理的动画帧请求
            if ((el as DragHTMLElement)._animationFrameId) {
                cancelAnimationFrame((el as DragHTMLElement)._animationFrameId!);
                (el as DragHTMLElement)._animationFrameId = undefined;
            }

            // 确保拖拽结束后，元素最终位置更新。
            // getTransformOffsets 会解析当前 transform 样式，其值已经是最终的 CSS 像素值。
            const { x, y } = getTransformOffsets(el);
            el.style.transform = `translate(${x}px, ${y}px)`; // 再次应用获取到的位置
            (el as DragHTMLElement)._lastRenderedX = x; // 更新最终渲染位置
            (el as DragHTMLElement)._lastRenderedY = y;

            // 移除全局事件监听器
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            // 移除拖拽时添加的 CSS 类
            el.classList.remove('is-dragging');
            handleEl.style.cursor = 'grab'; // 恢复手柄光标
        };

        // --- 绑定事件和性能优化 ---
        handleEl.addEventListener('mousedown', onMouseDown);

        // 性能优化：添加 will-change 属性
        // 告知浏览器该元素的 'transform' 属性将频繁变化，以便进行硬件加速
        el.style.willChange = 'transform';
        // 确保一开始就有初始位置
        el.style.transform = `translate(${(el as DragHTMLElement)._lastRenderedX || 0}px, ${(el as DragHTMLElement)._lastRenderedY || 0}px)`;


        // 存储清理函数，用于指令卸载时调用
        (el as DragHTMLElement)._onDragDestroy = () => {
            handleEl.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            el.style.removeProperty('will-change'); // 清理 will-change 属性
            el.classList.remove('is-dragging'); // 确保移除类
            handleEl.style.cursor = 'grab'; // 恢复手柄光标
        };
    },

    // 指令钩子：当绑定元素从 DOM 中卸载时调用
    unmounted(el: HTMLElement) {
        // 执行存储的清理函数
        (el as DragHTMLElement)._onDragDestroy?.();
        // 确保组件卸载时取消任何待处理的动画帧
        if ((el as DragHTMLElement)._animationFrameId) {
            cancelAnimationFrame((el as DragHTMLElement)._animationFrameId!);
        }
    }
}

export default drag;