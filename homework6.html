
    let numIntervals, numSamples, probabilityEntries = []; // Global variables

    document.getElementById('generateProbabilitiesBtn').addEventListener('click', function() {
        // Get the user input (intervals and samples)
        numIntervals = parseInt(document.getElementById('numIntervals').value);
        numSamples = parseInt(document.getElementById('numSamples').value);

        // Validate the input
        if (isNaN(numIntervals) || isNaN(numSamples) || numIntervals <= 0 || numSamples <= 0) {
            alert("Please enter valid numbers");
            return;
        }

        // Clear any previous probability input fields
        const probabilityInputsDiv = document.getElementById('probabilityInputs');
        probabilityInputsDiv.innerHTML = '';

        probabilityEntries = [];

        // Create input fields based on the number of intervals
        for (let i = 0; i < numIntervals; i++) {
            const label = document.createElement('label');
            label.textContent = `Probability for Interval ${i + 1}:`;

            const input = document.createElement('input');
            input.type = 'number';
            input.step = '0.01'; 
            input.min = '0';
            input.placeholder = 'Enter probability';

            // Push the input element into the array
            probabilityEntries.push(input);

            const div = document.createElement('div');
            div.appendChild(label);
            div.appendChild(input);

            // Append the div to the section
            probabilityInputsDiv.appendChild(div);
        }

        document.getElementById('plotGraphBtn').disabled = false;
    });

    document.getElementById('plotGraphBtn').addEventListener('click', function() {
        
        let probabilities = [];
        let midpoints = [];
        
        // Loop through all probability input fields
        for (let i = 0; i < numIntervals; i++) {
            const prob = parseFloat(probabilityEntries[i].value);
            
            // Probabilities must be between 0 and 1
            if (isNaN(prob) || prob < 0 || prob > 1) {
                alert("Please enter valid probabilities between 0 and 1.");
                return;
            }
            probabilities.push(prob);
            midpoints.push(i + 1);
        }

        // Check if the sum of all probabilities is close to 1
        const sumProbabilities = probabilities.reduce((a, b) => a + b, 0);
        if (Math.abs(sumProbabilities - 1) > 0.001) {
            alert("The sum of probabilities must be equal to 1.");
            return;
        }

        // Generate random samples based on the given probabilities
        let samples = [];
        for (let i = 0; i < numSamples; i++) {
            const rand = Math.random();
            let cumulativeProb = 0;
            
            // Find the interval corresponding to the random number
            for (let j = 0; j < numIntervals; j++) {
                cumulativeProb += probabilities[j];
                if (rand <= cumulativeProb) {
                    samples.push(j + 1);
                    break;
                }
            }
        }

        // Count the occurrences of samples in each interval
        let occurrences = new Array(numIntervals).fill(0);
        samples.forEach(sample => {
            occurrences[sample - 1]++; // Increment the count for the corresponding interval
        });

        // Calculate the empirical mean and variance based on sample counts
        const empiricalMean = occurrences.reduce((sum, count, idx) => sum + (midpoints[idx] * count), 0) / numSamples;
        const empiricalVariance = occurrences.reduce((sum, count, idx) => sum + (Math.pow(midpoints[idx] - empiricalMean, 2) * count), 0) / numSamples;

        // Calculate the theoretical mean and variance based on probabilities
        const theoreticalMean = probabilities.reduce((sum, prob, idx) => sum + (midpoints[idx] * prob), 0);
        const theoreticalVariance = probabilities.reduce((sum, prob, idx) => sum + (Math.pow(midpoints[idx] - theoreticalMean, 2) * prob), 0);

        // Display the calculated statistics
        document.getElementById('empiricalMean').textContent = `Empirical Mean: ${empiricalMean.toFixed(3)}`;
        document.getElementById('empiricalVariance').textContent = `Empirical Variance: ${empiricalVariance.toFixed(3)}`;
        document.getElementById('theoreticalMean').textContent = `Theoretical Mean: ${theoreticalMean.toFixed(3)}`;
        document.getElementById('theoreticalVariance').textContent = `Theoretical Variance: ${theoreticalVariance.toFixed(3)}`;

        // Plot the probability distribution graph
        plotGraph(probabilities, occurrences);
    });

    // Function to plot the theoretical and empirical distributions
    function plotGraph(theoretical, occurrences) {
        const ctx = document.getElementById('distributionChart').getContext('2d');

        const chartData = {
            labels: Array.from({ length: numIntervals }, (_, i) => `Interval ${i + 1}`),
            datasets: [
                {
                    label: 'Theoretical Distribution', 
                    data: theoretical.map(p => p * numSamples), 
                    backgroundColor: 'rgba(255, 159, 64, 0.5)', 
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Empirical Distribution (Counts)', 
                    data: occurrences,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        };

        // Chart configuration
        const config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true, 
                        ticks: {
                            stepSize: 1 
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top', 
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                            }
                        }
                    }
                }
            }
        };

        // Destroy existing chart if one exists
        if (window.barChart) {
            window.barChart.destroy();
        }

        // Create a new bar chart
        window.barChart = new Chart(ctx, config);
    }
