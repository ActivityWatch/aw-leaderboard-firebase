<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted} from 'vue';
import type { ScreenTimeSummary } from '@/types';
import autocolors from 'chartjs-plugin-autocolors';
import { Chart as ChartJS, Legend, BarElement, BarController,CategoryScale, LinearScale, Tooltip, Title } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement,BarController, CategoryScale, LinearScale, autocolors)

interface Props {
  summaries: ScreenTimeSummary[] | null;
}

const props = defineProps<Props>();
const canvasRef = ref<HTMLCanvasElement>();

const getChartData = () => {
  const uniqueDates = Array.from(new Set(props.summaries?.map((summary) => summary.date)));
  const uniqueDatesSorted = uniqueDates.sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });
  const uniqueWeekDays = uniqueDatesSorted.map((date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const uniqueCategoriesSet: Set<string> = new Set();
  props.summaries?.forEach((summary) => {
    for (const category in summary.categoryTotals) {
      uniqueCategoriesSet.add(category);
    }
  });
  const uniqueCategories = Array.from(uniqueCategoriesSet);
  const categoryTotals: number[] = [];
  for (const category of uniqueCategories) {
    const categoryTotal = props.summaries?.reduce((acc, summary) => {
      return acc + (summary.categoryTotals[category] || 0);
    }, 0);
    categoryTotals.push(categoryTotal || 0);
  }
  return {
    labels: uniqueWeekDays,
    datasets: uniqueCategories.map((category) => {
      return {
        label: category,
        data: props.summaries?.map((summary) => summary.categoryTotals[category] || 0)
      };
    })
  };
};

const renderChart = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ChartJS.getChart(canvas)?.destroy();

  new ChartJS(ctx, {
    type: 'bar',
    data: getChartData(),
    options: {
  responsive: true,
  plugins: {
    legend: {
      display: true
    }
  },
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
}
  });
};

watch( () => props.summaries, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    renderChart();
  }
}, { deep: true })
onMounted(()=>{
  renderChart()
})

</script>