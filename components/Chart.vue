<template>
    <div id="chart" style="height: 400px; width: 100%;"></div>
</template>

<script setup>
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    MarkPointComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
    MarkPointComponent
]);
const props = defineProps({
    data: Object
})

const oddsData = computed(() => {
    const oddFields = Object.values(props.data).flatMap(yearObj =>
  Object.values(yearObj))
  return oddFields
})

const x = computed(() => {
    return oddsData.value.filter(x => x.phase === '2C').map(x => x.year)
})

const y2C = computed(() => {
    return oddsData.value.filter(x => x.phase === '2C').map(x => x.odds)
})

const y2B = computed(() => {
    return oddsData.value.filter(x => x.phase === '2B').map(x => x.odds)
})

const y2A = computed(() => {
    return oddsData.value.filter(x => ['2A', '2A(1)'].includes(x.phase)).map(x => x.odds)
})


onMounted(()=>{
    var chartDom = document.getElementById('chart');
    var myChart = echarts.init(chartDom);
    var option;

    option = {

        tooltip: {
            trigger: 'axis',
            // formatter: function (params) {
            // console.log(params)
            // return `2B: ${params[0].value * 100}%<br>2C: ${params[1].value*100}%`
            // }
            valueFormatter: (value) => {
                // console.log(value[0])
                return (value * 100).toFixed(0) + '%'
            }

        },
        grid: {
            left: '12%',
            right: '3%',
        },
        legend: {
            data: ['2A', '2B', '2C'],
            bottom: 0,
        },

        xAxis: {
            type: 'category',
            data: x.value
        },
        yAxis: {
            type: 'value',
            name: "odds %",
            axisLabel: {
                formatter: (value) => {
                    return 100 * value + '%';
                }
            }
        },
        series: [
            {
                name: '2A',
                data: y2A.value,
                type: 'line',
                smooth: true,
            },
            {
                name: '2B',
                data: y2B.value,
                type: 'line',
                smooth: true,
                // markPoint: {
                //     data: [
                //         {
                //             name: 'mark',
                //             xAxis: 2023,
                //             yAxis: 50,
                //             value: 'x'
                //         }
                //     ]
                // },
            },
            {
                name: '2C',
                data: y2C.value,
                type: 'line',
                smooth: true
            }
        ]
    };

    option && myChart.setOption(option);
})

</script>