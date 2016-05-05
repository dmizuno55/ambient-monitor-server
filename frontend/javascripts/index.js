(function() {
  'use strict'

  google.charts.load('current', {packages: ['corechart']});
  const _ = require('lodash');
  const axios = require('axios');

  const defineUnitWidth = function(time) {
    const range = [60, 30, 2, 24, 30, 12];

    let unitWidth = 1000;

    _.forEach(range, num => {
      unitWidth *= num;
      if (time / unitWidth <= num) {
        return false;
      }
    });

    return unitWidth;
  };

  const getTermTicks = function(start, end) {
    const ticks = [];
    const deltaTime = end.getTime() - start.getTime();
    const unitWidth = defineUnitWidth(deltaTime);
    const partitionNum = Math.round(deltaTime / unitWidth);

    for (let i = 0; i < partitionNum; i++) {
      const d = new Date(start.getTime() + (i * unitWidth));
      ticks.push(d);
    }

    return ticks;
  };

  const getOptions = function(start, end) {
    const ticks = getTermTicks(start, end);

    return {
      title: '温湿度',
      width: 900,
      height: 500,
      series: {
        0: {targetAxisIndex: 0},
        1: {targetAxisIndex: 1}
      },
      vAxes: {
        y: {
          0: {title: '温度'},
          1: {title: '湿度'}
        }
      },
      hAxis: {
        ticks: ticks,
        gridlines: {
          count: ticks.length
        }
      }
    };
  };

  const drawChart = function() {
    const baseDate = new Date();
    const startDate = new Date(baseDate.getTime() - 30 * 60 * 1000);
    const endDate = new Date(baseDate.getTime());

    axios.get('/api/atmos', {
        params: {
          from: startDate.getTime(),
          to: endDate.getTime()
        }
      })
      .then(response => {
        if (response.status !== 200) {
          return;
        }

        const responseBody = response.data;

        if (!responseBody.result.length) {
          return;
        }

        const options = getOptions(startDate, endDate);

        const data = responseBody.result.map(record => {
          return [
            new Date(record.time),
            record.temperature,
            record.humdity
          ];
        });

        const table = new google.visualization.DataTable();
        table.addColumn('datetime', '時間');
        table.addColumn('number', '温度');
        table.addColumn('number', '湿度');
        table.addRows(data);
        
        const chart = new google.visualization.LineChart(document.getElementById('graph'));
        chart.draw(table, options);
      });
  };

  const redrawChart = function(interval) {
    setTimeout(() => {
      drawChart();
      redrawChart(interval);
    }, interval);
  };

  google.charts.setOnLoadCallback(drawChart);

  redrawChart(30000);
})();
