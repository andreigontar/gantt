import type RowItem from '@/models/data/row';
import { useStore } from '@/store';
import { type RowData } from '@/typings/data';
import { type Slots } from 'vue';
import useData from './useData';

export default () => {
  const store = useStore();

  function setSlots(slots: Slots) {
    store.$slotsBox.setSlots(slots);
  }

  const { toRowData } = useData();

  function isMerge(
    m: boolean | undefined | ((data: RowData) => boolean),
    data: RowItem
  ) {
    return typeof m === 'function' ? m(toRowData(data)) : !!m;
  }

  // watch(
  //   () => [store.$styleBox.showCheckbox],
  //   () => {
  //     store.$slotsBox.setSlots(store.$slotsBox.cols);
  //   }
  // );

  return { $slotsBox: store.$slotsBox, setSlots, isMerge };
};
