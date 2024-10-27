        let charts = [];

        function simulateAttacks() {
            // Input
            const n = parseInt(document.getElementById('numServers').value);
            const m = parseInt(document.getElementById('numAttackers').value);
            const p = parseFloat(document.getElementById('penetrationProb').value);
            
            // Input control
            if (n < 1 || m < 1 || p < 0 || p > 1) {
                alert("Please enter valid values.");
                return;
            }
            
            const simulateBtn = document.getElementById('simulateBtn');
            simulateBtn.disabled = true;

            const random = () => Math.random();
            let penCounts = Array(m).fill(0);
            let allAttackerData = Array.from({ length: m }, () => []);
            let midPenCounts = Array(m).fill(0);
            let endPenCounts = Array(m).fill(0);
            let midFrequenciesAbsolute = {};
            let endFrequenciesAbsolute = {};

            for (let server = 0; server < n; server++) {
                for (let att = 0; att < m; att++) {
                    if (random() < p) {
                        penCounts[att]++;   // Success
                    } else {
                        penCounts[att]--;   // Fail
                    }
                    allAttackerData[att].push(penCounts[att]);   // To save the result
                    
                    if (server === Math.floor(n / 2)) {
                        midPenCounts[att] = penCounts[att];    // To create the middle distributions
                    }
                }
            }

            calculateFrequencies(midPenCounts, midFrequenciesAbsolute);
            plotFrequencyDistribution(midFrequenciesAbsolute, 'chart4');
            plotRelativeFrequencyDistribution(midFrequenciesAbsolute, 'chart5');

            endPenCounts = [...penCounts];
            calculateFrequencies(endPenCounts, endFrequenciesAbsolute);
            plotFrequencyDistribution(endFrequenciesAbsolute, 'chart6');
            plotRelativeFrequencyDistribution(endFrequenciesAbsolute, 'chart7');

            plotAttackSimulation(allAttackerData);
            simulateBtn.disabled = false;
        }

        function calculateFrequencies(penCounts, frequencyData) {  // To calculate the frequencies
            penCounts.forEach(count => {
                frequencyData[count] = (frequencyData[count] || 0) + 1;
            });
        }

        function calculateStatistics(data) {    // To calculate the statistics with recursive formulas
            let mean = 0;
            let variance = 0;
            const n = data.length;

            data.forEach((value, index) => {
                mean = mean + (value - mean) / (index + 1);
                variance = variance + (value * value - mean * mean - variance) / (index + 1);
            });

            return { mean, variance };
        }

        function plotAttackSimulation(allAttackerData) {   // To graph the attacks
            const ctx = document.getElementById('chart1').getContext('2d');
            destroyChart(0);

            const datasets = allAttackerData.map((data) => ({
                data: data,
                borderColor: getRandomColor(),
                fill: false
            }));

            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: allAttackerData[0].length }, (_, i) => i + 1),
                    datasets: datasets
                },
                options: {
                    plugins: {
                        legend: { display: false }
                    },
                    scales: { y: { beginAtZero: true } }
                }
            });
            charts[0] = chart;
        }

        function plotFrequencyDistribution(frequencyData, chartId) {    // To graph the distribution
            const ctx = document.getElementById(chartId).getContext('2d');
            const index = chartId === 'chart4' ? 1 : 3;

            destroyChart(index);
            const stats = calculateStatistics(Object.keys(frequencyData).map(Number));
            console.log(`Chart: ${chartId}, Mean: ${stats.mean}, Variance: ${stats.variance}`);

            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(frequencyData),
                    datasets: [{
                        data: Object.values(frequencyData),
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: `Mean: ${stats.mean.toFixed(2)}, Variance: ${stats.variance.toFixed(2)}`
                        }
                    },
                    scales: { y: { beginAtZero: true } }
                }
            });
            charts[index] = chart;
        }

        function plotRelativeFrequencyDistribution(frequencyData, chartId) {  // To graph the relative frequencies
            const ctx = document.getElementById(chartId).getContext('2d');
            const total = Object.values(frequencyData).reduce((sum, value) => sum + value, 0);
            const index = chartId === 'chart5' ? 2 : 4;

            destroyChart(index);

            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(frequencyData),
                    datasets: [{
                        data: Object.values(frequencyData).map(value => value / total),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: `Relative Frequencies`
                        }
                    },
                    scales: { y: { beginAtZero: true } }
                }
            });
            charts[index] = chart;
        }

        function destroyChart(index) {
            if (charts[index]) {
                charts[index].destroy();
                charts[index] = null;
            }
        }

        function getRandomColor() {    // To generate a random color
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
