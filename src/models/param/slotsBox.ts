import Variables from '@/constants/vars';
import SliderVue from '@/components/slider/index.vue';
import { type Component, type VNode, h, type Slots } from 'vue';
import Header from './header';

export default class SlotsBox {
  headers!: Header;
  cols!: VNode[];
  slider!: VNode;

  constructor() {
    this.init();
  }

  private init() {
    this.headers = new Header();
    this.cols = [];
    this.slider = h(SliderVue);
  }

  private static __checkType(type: string, target: string) {
    return (
      type.replace(/-/g, '').toLocaleLowerCase() === target.toLocaleLowerCase()
    );
  }

  private static __isCustomComponent(v: any): v is Component {
    return !!v.type?.name && !!v.type?.setup;
  }

  private setMultiColumns(col: VNode, column: Header['columns'][0]) {
    const s: any = (col.children as any)?.default;

    if (s) {
      try {
        s()
          .filter((v: any) => {
            const type = (v.type as Component)?.name;
            return type && SlotsBox.__checkType(type, Variables.name.column);
          })
          .forEach((v: any) => {
            const c = this.headers.setSubColumns(v, column);

            this.setMultiColumns(v, c);
          });
      } catch (err) {
        // pass
      }
    }
  }

  /**
   * 将 columns 的叶子结点平铺
   */
  private setLeafCols() {
    this.cols = this.headers.leafs.map(v => v.node);
  }

  setSlots(slots: Slots) {
    this.init();

    // let colVNodeKey = 0;

    // 1、slots.default 应该只包含 x-gantt-column 和 x-gantt-slider
    if (slots.default) {
      slots
        .default()
        .filter(v => {
          const type = (v.type as Component)?.name;

          // 只接收自定义的两个组件
          return (
            type &&
            SlotsBox.__isCustomComponent(v) &&
            [Variables.name.column, Variables.name.slider]
              .map(n => SlotsBox.__checkType(type, n))
              .includes(true)
          );
        })
        .forEach((v, index) => {
          console.log('vvvv', v);

          const type = (v.type as Component).name as string;

          if (SlotsBox.__checkType(type, Variables.name.slider)) {
            // 如果是 slider，直接赋值。多个 XGanttSlider 保留最后一个
            this.slider = v;
          } else if (SlotsBox.__checkType(type, Variables.name.column)) {
            // column，则要放到 header 中去，然后还要有叶子结点的渲染
            this.headers.setColumns(v);

            // 看一下有没有嵌套 x-gantt-column，如果有，表示需要嵌套表头
            this.setMultiColumns(v, this.headers.columns[index]);
          }
        });

      // 生成表头需要的内容
      this.headers.generate();

      // 生成完表头，就可以获取用于渲染内容的叶子节点的 column
      this.setLeafCols();

      console.log('cols', this.cols);
      console.log('headers', this.headers);
    }

    // 2、如果有预定义的命名插槽，单独处理
  }
}
