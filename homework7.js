    let numIntervals, size, numSimulations, probabilityEntries = []; 

    document.getElementById('generateProbabilitiesBtn').addEventListener('click', function() {

        // Get the user input
        numIntervals = parseInt(document.getElementById('numIntervals').value);
        size = parseInt(document.getElementById('size').value);
        numSimulations = parseInt(document.getElementById('numSimulations').value);

        // Validate the input
        if (isNaN(numIntervals) || isNaN(size) || isNaN(numSimulations) || numIntervals <= 0 || size <= 0 || numSimulations <= 0) {
            alert("Please enter valid numbers");  // Alert if input is invalid
            return;
        }

        const probabilityInputsDiv = document.getElementById('probabilityInputs');
        probabilityInputsDiv.innerHTML = '';  // Clear previous input fields

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

            probabilityEntries.push(input);

            const div = document.createElement('div'); 
            div.appendChild(label); 
            div.appendChild(input); 

            probabilityInputsDiv.appendChild(div);
        }

        // After generating input fields, enable the button
        document.getElementById('plotGraphBtn').disabled = false;
    });

    document.getElementById('plotGraphBtn').addEventListener('click', function() {

        let probabilities = [];  // The probabilities entered by the user
        let midpoints = []; 

        // All probability input fields
        for (let i = 0; i < numIntervals; i++) {
            const prob = parseFloat(probabilityEntries[i].value);  // Get the value from the input field
            
            // Probabilities must be between 0 and 1
            if (isNaN(prob) || prob < 0 || prob > 1) {
                alert("Please enter valid probabilities between 0 and 1."); 
                return;
            }
            probabilities.push(prob);  // Add the probability
            midpoints.push(i + 1);
        }

        // Check if the sum of all probabilities is close to 1
        const sumProbabilities = probabilities.reduce((a, b) => a + b, 0);
        if (Math.abs(sumProbabilities - 1) > 0.001) {
            alert("The sum of probabilities must be equal to 1.");
            return;
        }

        // Run simulations 
        let simulationMeans = [];  // To store the mean values from simulations
        let occurrences = simulateDistribution(probabilities, size);
        simulationMeans.push(calculateSimulationMean(occurrences, midpoints)); 
        
        for (let i = 1; i < numSimulations; i++) {
            occurrences = simulateDistribution(probabilities, size);  // Run another simulation
            simulationMeans.push(calculateSimulationMean(occurrences, midpoints));  // Calculate mean for the new simulation
        }

        // Calculate the theoretical mean and variance of averages
        let theoreticalMean = probabilities.reduce((sum, prob, idx) => sum + (midpoints[idx] * prob), 0); 
        let theoreticalVariance = probabilities.reduce((sum, prob, idx) => sum + (Math.pow(midpoints[idx] - theoreticalMean, 2) * prob), 0);
        let theoreticalVarianceOfAverages = theoreticalVariance / size;

        // Calculate the empirical mean and variance of averages
        let empiricalMean = calculateMean(simulationMeans); 
        let empiricalVariance = calculateVariance(simulationMeans, empiricalMean);  

        // Display the statistics
        document.getElementById('empiricalMean').textContent = `Empirical Mean of Averages: ${empiricalMean.toFixed(3)}`;
        document.getElementById('empiricalVariance').textContent = `Empirical Variance of Averages: ${empiricalVariance.toFixed(3)}`;
        document.getElementById('theoreticalMean').textContent = `Theoretical Mean of Averages: ${theoreticalMean.toFixed(3)}`;
        document.getElementById('theoreticalVariance').textContent = `Theoretical Variance of Averages: ${theoreticalVarianceOfAverages.toFixed(3)}`;

        // Calculate theoretical counts for each interval
        let theoreticalCounts = probabilities.map(prob => prob * size);

        // Plot the distribution graph
        plotGraph(theoreticalCounts, occurrences);
    });

    // To simulate the distribution and count occurrences
    function simulateDistribution(probabilities, sampleSize) {
        let occurrences = new Array(probabilities.length).fill(0);

        for (let i = 0; i < sampleSize; i++) {
            const rand = Math.random();  
            let cumulativeProb = 0;

            // Loop through probabilities 
            for (let j = 0; j < probabilities.length; j++) {
                cumulativeProb += probabilities[j];
                if (rand <= cumulativeProb) {
                    occurrences[j]++;  // Increment the occurrence for the selected interval
                    break;
                }
            }
        }

        return occurrences;
    }

    // To calculate the mean
    function calculateMean(values) {
        let sum = values.reduce((a, b) => a + b, 0);  // Sum all values
        return sum / values.length;  // Return the mean
    }

    // To calculate the variance
    function calculateVariance(values, mean) {
        let squaredDiffs = values.map(value => Math.pow(value - mean, 2));  // Calculate squared differences from the mean
        let variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;  // Return variance as the average of squared differences
        return variance;
    }

    // To calculate the mean of a simulation
    function calculateSimulationMean(occurrences, midpoints) {
        let sum = occurrences.reduce((acc, occ, idx) => acc + (occ * midpoints[idx]), 0);  // Multiply occurrences by midpoints and sum them
        return sum / occurrences.reduce((a, b) => a + b, 0); 
    }

    // To plot the graph
    function plotGraph(theoreticalCounts, occurrences) {
        const ctx = document.getElementById('distributionChart').getContext('2d'); 
        const chartData = {
            labels: Array.from({ length: numIntervals }, (_, i) => `Interval ${i + 1}`),  
            datasets: [
                {
                    label: 'Theoretical Distribution (Counts)', 
                    data: theoreticalCounts,  
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

        const config = {
            type: 'bar',  
            data: chartData, // Data
            options: {
                responsive: true, 
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
                },
                scales: {
                    y: {
                        beginAtZero: true,  // Start y-axis at zero
                        ticks: {
                            stepSize: 1  // Set y-axis tick steps to 1
                        }
                    }
                }
            }
        };

        new Chart(ctx, config);  // Create a new chart with the given config
    }
