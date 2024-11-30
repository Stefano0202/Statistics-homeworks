    let numIntervals, size, numSimulations, probabilityEntries = []; 
    let midpoints = [];

    // When the user clicks on the first button
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
        midpoints = [];

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

            midpoints.push(i + 1); // Store the midpoint for each interval

            const div = document.createElement('div'); 
            div.appendChild(label); 
            div.appendChild(input); 

            probabilityInputsDiv.appendChild(div);
        }

        // After generating input fields, enable the button
        document.getElementById('plotGraphBtn').disabled = false;
    });

    // When the user clicks the second button
    document.getElementById('plotGraphBtn').addEventListener('click', function() {

        let probabilities = [];  // The probabilities entered by the user
        for (let i = 0; i < numIntervals; i++) {
            const prob = parseFloat(probabilityEntries[i].value);  // Get the value from the input field
            
            // Probabilities must be between 0 and 1
            if (isNaN(prob) || prob < 0 || prob > 1) {
                alert("Please enter valid probabilities between 0 and 1."); 
                return;
            }
            probabilities.push(prob);  // Add the probability
        }

        // Check if the sum of all probabilities is close to 1
        const sumProbabilities = probabilities.reduce((a, b) => a + b, 0);
        if (Math.abs(sumProbabilities - 1) > 0.001) {
            alert("The sum of probabilities must be equal to 1.");
            return;
        }

        // Run simulations and store the variances
        let sampleVariances = [];  
        let occurrences = simulateDistribution(probabilities, size);

        // Calculate the sample variances for each simulation
        for (let i = 0; i < numSimulations; i++) {
            let sampleMean = calculateSimulationMean(occurrences, midpoints); 
            let uncorrectedVariance = calculateSampleVariance(occurrences, sampleMean, size, false);  
            let correctedVariance = calculateSampleVariance(occurrences, sampleMean, size, true);  
            sampleVariances.push({uncorrected: uncorrectedVariance, corrected: correctedVariance}); 
            occurrences = simulateDistribution(probabilities, size);  // Run another simulation
        }

        // Calculate the theoretical mean and variance of the distribution
        let theoreticalMean = probabilities.reduce((sum, prob, idx) => sum + (midpoints[idx] * prob), 0); 
        let theoreticalVariance = probabilities.reduce((sum, prob, idx) => sum + (Math.pow(midpoints[idx] - theoreticalMean, 2) * prob), 0);

        // Calculate the empirical mean and variance of the sample variances
        let empiricalMeanUncorrected = calculateMean(sampleVariances.map(v => v.uncorrected)); 
        let empiricalVarianceUncorrected = calculateVariance(sampleVariances.map(v => v.uncorrected), empiricalMeanUncorrected);  

        let empiricalMeanCorrected = calculateMean(sampleVariances.map(v => v.corrected)); 
        let empiricalVarianceCorrected = calculateVariance(sampleVariances.map(v => v.corrected), empiricalMeanCorrected);  

        // Display the statistics
        document.getElementById('empiricalMean').textContent = `Empirical Mean of Sample Variances: ${empiricalMeanUncorrected.toFixed(3)}`;
        document.getElementById('empiricalVariance').textContent = `Empirical Variance of Sample Variances: ${empiricalVarianceUncorrected.toFixed(3)}`;
        document.getElementById('empiricalCorrectedVariance').textContent = `Empirical Corrected Variance of Sample Variances: ${empiricalVarianceCorrected.toFixed(3)}`;
        document.getElementById('theoreticalMean').textContent = `Theoretical Mean: ${theoreticalMean.toFixed(3)}`;
        document.getElementById('theoreticalVariance').textContent = `Theoretical Variance: ${theoreticalVariance.toFixed(3)}`;

        // Calculate theoretical counts for each interval (expected frequency)
        let theoreticalCounts = probabilities.map(prob => prob * size);

        // Plot the graph with frequencies on the y-axis
        plotGraph(theoreticalCounts, occurrences);
    });

    // To simulate the various distributions
    function simulateDistribution(probabilities, sampleSize) {
        let occurrences = Array(midpoints.length).fill(0);
        for (let i = 0; i < sampleSize; i++) {
            let rand = Math.random();
            let cumulativeProbability = 0;
            for (let j = 0; j < probabilities.length; j++) {
                cumulativeProbability += probabilities[j];
                if (rand <= cumulativeProbability) {
                    occurrences[j]++;
                    break;
                }
            }
        }
        return occurrences;
    }

    // To calculate the mean of the simulation
    function calculateSimulationMean(occurrences, midpoints) {
        let total = 0;
        for (let i = 0; i < occurrences.length; i++) {
            total += occurrences[i] * midpoints[i];
        }
        return total / occurrences.reduce((sum, occ) => sum + occ, 0);
    }

    // To calculate the sample variance
    function calculateSampleVariance(occurrences, sampleMean, sampleSize, corrected) {
        let sumSquares = 0;
        for (let i = 0; i < occurrences.length; i++) {
            sumSquares += occurrences[i] * Math.pow(midpoints[i] - sampleMean, 2);
        }
        // If corrected is true, we calculate the correct variance (with n-1)
        return corrected ? sumSquares / (sampleSize - 1) : sumSquares / sampleSize;
    }

    // To calculate the mean
    function calculateMean(arr) {
        return arr.reduce((sum, value) => sum + value, 0) / arr.length;
    }

    // To calculate the variance
    function calculateVariance(arr, mean) {
        return arr.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / arr.length;
    }

    function plotGraph(theoreticalCounts, occurrences) {
        const ctx = document.getElementById('distributionChart').getContext('2d');
        
        // Remove previous chart if exists
        if (window.chart) {
            window.chart.destroy();
        }

        // Create new chart
        window.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: midpoints,
                datasets: [
                    {
                        label: 'Theoretical Distribution',
                        data: theoreticalCounts,
                        backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    },
                    {
                        label: 'Simulated Distribution',
                        data: occurrences,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Frequency' 
                        }
                    }
                }
            }
        });
    }
