<template>
  <table
    ref="ganttHeaderRef"
    class="xg-gantt-header"
    :style="{ height: `${$param.headerHeight}px` }"
    cellpadding="0"
    cellspacing="0"
    border="0"
  >
    <colgroup>
      <template v-for="(c, i) in dateList[1]" :key="i">
        <col
          :width="`${getGanttUnitColumnWidth(
            c.date.date,
            i === 0
              ? 'after'
              : i === dateList[1].length - 1
              ? 'before'
              : undefined
          )}px`"
        />
      </template>
    </colgroup>

    <thead>
      <tr v-for="(r, trIndex) in dateList" :key="trIndex">
        <th
          style="height: 48px"
          v-for="(c, i) in r"
          :key="i"
          :class="[
            'xg-gantt-header-cell',
/*             {
              highlight:
                $styleBox.highlightDate &&
                trIndex === dateList.length - 1 &&
                ['day', 'hour'].includes(ganttHeader.unit) &&
                ($param.hoverItem?.start.isSame(c.date, ganttHeader.unit) ||
                  $param.hoverItem?.end.isSame(c.date, ganttHeader.unit))
            }, */
            { 'xg-gantt-header-cell__each': trIndex !== 0 }
          ]"
          :style="{
            'border-color': $styleBox.borderColor,
            color: $styleBox.headerStyle?.textColor,
            // backgroundColor: $styleBox.headerStyle?.bgColor || $styleBox.primaryColor
            backgroundColor: 'white'
          }"
          :colspan="c.colSpan"
          :rowspan="c.rowSpan"
        >
          <div v-if="c.level == 1" class="title-month-cell" :class="{'title-month-cell__active': c?.isCurrentMonth}">
            <div class="item">{{ moment(c.date.date).format('MMM YYYY') }}</div>
            <div class="item">{{ moment(c.date.date).format('MMM YYYY') }}</div>
          </div>
          <div v-else class="title-day-cell">
            <div>{{ moment(c.date.date).format('D') }}</div>
            <div class="title-day-cell__month">{{ moment(c.date.date).format('llll').charAt(0) }}</div>
          </div>
        </th>
      </tr>
    </thead>
  </table>
</template>

<script lang="ts" setup>
import useData from '@/composables/useData';
import useGanttWidth from '@/composables/useGanttWidth';
import useStyle from '@/composables/useStyle';
import useParam from '@/composables/useParam';
import useElement from '@/composables/useElement';
import { computed, onMounted, onUpdated } from "vue";
import useGanttHeader from '@/composables/useGanttHeader';
import moment from "moment/moment";

const { $param } = useParam();
const { $styleBox } = useStyle();
const { dateList } = useData();
const { getGanttUnitColumnWidth } = useGanttWidth();
const { ganttHeaderRef, updateHeaderHeight } = useElement();
const { ganttHeader } = useGanttHeader();

onMounted(updateHeaderHeight);
onUpdated(updateHeaderHeight);
</script>

<style lang="scss">
.xg-gantt-header {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  top: 0;
  position: sticky;
  z-index: 10;
  white-space: nowrap;
  overflow: hidden;

  .xg-gantt-header-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    border-bottom: 1px solid #EEEEEE;
    border-right: 1px solid #EEEEEE;
    font-size: 18px;
  }

  .xg-gantt-header-cell__each {
    font-size: 14px;
    word-wrap: break-word;
  }

  .highlight {
    filter: brightness(1.2);
  }
  .title-day-cell {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    &__month {
    }
  }
  .title-month-cell {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    padding: 0 10px;

    .item {
      color: #A3A5A9;
    }

    &__active {
      .item {
        color: #161616;
      }
    }
  }
}
</style>
