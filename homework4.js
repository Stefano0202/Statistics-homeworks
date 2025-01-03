
        const random = () => Math.random(); // To generate a random number between 0 and 1

        // Initialize charts
        let attackerChartInstance = null;
        let frequencyChartInstance = null;

        document.getElementById('resetButton').addEventListener('click', function() {
            document.getElementById('servers').value = 0;
            document.getElementById('attackers').value = 0;
            document.getElementById('probability').value = 0.7;
            // Clear the charts
            if (attackerChartInstance) attackerChartInstance.destroy();
            if (frequencyChartInstance) frequencyChartInstance.destroy();
        });

        document.getElementById('startButton').addEventListener('click', function() {
            const n = parseInt(document.getElementById('servers').value); // Get number of servers
            const m = parseInt(document.getElementById('attackers').value); // Get number of attackers
            const p = parseFloat(document.getElementById('probability').value); // Get probability of penetration
            
            if (n < 0 || m < 0 || p < 0 || p > 1) {
                alert('Please enter valid inputs!');
                return;
            }
            
            runSimulation(n, m, p);
        });

        function runSimulation(n, m, p) { 
            const penCounts = []; // To save the counts of penetrated servers
            const penResults = []; // To save results for each attacker
            
            // Simulate each attacker
            for (let att = 0; att < m; att++) {
                const penetrationCount = simulateAttacker(n, p, penResults); // Simulate the penetration
                penCounts.push(penetrationCount); // Store the penetration count
            }

            plotAttackerResults(penResults, n); // Plot results
            plotFrequencyDistribution(penCounts, n); // Plot frequency distribution
        }

        function simulateAttacker(n, p, penResults) { // Simulate an individual attempts
            penResults[penResults.length] = []; // Initialize results
            let score = 0; // Initialize score
            const increment = 1 / Math.sqrt(n); // Calculate increment/decrement

            // Simulate penetration attempts on servers
            for (let j = 0; j < n; j++) {
                const penetrated = random() < p; // Determine if the server is penetrated
                penResults[penResults.length - 1].push(penetrated); // Store result
                
                score += penetrated ? increment : -increment; // Update score
            }

            return score; // Return the total score
        }

        function plotAttackerResults(penResults, n) { // Function to plot results
            const ctx = document.getElementById('attackerChart').getContext('2d'); // Get canvas context for the attacker chart
            const datasets = penResults.map((results) => { // Create datasets
                const data = results.reduce((acc, penetrated) => { // Calculate cumulative penetrations
                    const increment = 1 / Math.sqrt(n);
                    const lastValue = acc.length ? acc[acc.length - 1] : 0;
                    acc.push(lastValue + (penetrated ? increment : -increment));
                    return acc;
                }, []);
                
                return {
                    data: data, // Data 
                    borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
                    fill: false, // No fill under the line
                    tension: 0.1 // Smooth line
                };
            });

            // Destroy previous chart instance if it exists
            if (attackerChartInstance) {
                attackerChartInstance.destroy();
            }

            attackerChartInstance = new Chart(ctx, { // Create a new chart
                type: 'line', // Line chart type
                data: {
                    labels: Array.from({length: n}, (_, i) => i + 1), // X-axis labels for servers
                    datasets: datasets // Datasets for the chart
                },
                options: {
                    plugins: {
                        legend: {
                            display: false // Hide the legend
                        }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Number of Servers' } },
                        y: { title: { display: true, text: 'Score (Max: √n)' } }
                    }
                }
            });
        }

        function plotFrequencyDistribution(penCounts, n) { // Function to plot frequency distribution
            const frequencyMap = Array(Math.floor(Math.sqrt(n)) + 1).fill(0); // To save frequency counts
            penCounts.forEach(count => {
                const index = Math.max(0, Math.min(Math.floor(count), frequencyMap.length - 1)); // Ensure index is within bounds
                frequencyMap[index]++; // Count occurrences of each count
            });

            const ctx = document.getElementById('frequencyChart').getContext('2d');
            
            // Destroy previous chart instance if it exists
            if (frequencyChartInstance) {
                frequencyChartInstance.destroy();
            }

            frequencyChartInstance = new Chart(ctx, { // Create a new chart
                type: 'bar', // Bar chart type
                data: {
                    labels: Array.from({length: frequencyMap.length}, (_, i) => i), // X-axis labels for scores
                    datasets: [{
                        data: frequencyMap, // Data
                        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color for bars
                        borderColor: 'rgba(75, 192, 192, 1)', // Border color for bars
                        borderWidth: 1 // Border width
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false // Hide the legend
                        }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Score (Max: √n)' } },
                        y: { title: { display: true, text: 'Frequency' } }
                    }
                }
            });
        }
