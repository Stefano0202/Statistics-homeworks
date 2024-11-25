// To process the text
function processText() {
    const text = document.getElementById("inputText").value;
    if (text === "") {
        alert("Please enter some text.");
        return;
    }

    // To calculate letter frequency distribution
    const freqDist = calculateFrequency(text);

    // To choose a random shift value for Caesar Cipher
    const shift = Math.floor(Math.random() * 25) + 1;
    const encryptedText = applyCaesarCipher(text, shift);

    // To decrypt the encrypted text
    const decryptedText = decryptWithFrequencyAnalysis(encryptedText);

    // To graph the frequency distribution
    graphFrequencyDistribution(freqDist);

    document.getElementById("output").innerHTML = `
        <h3>Caesar Cipher Encrypted Text (Shift ${shift}):</h3>
        <pre>${encryptedText}</pre>
        <h3>Decrypted Text (Using Frequency Analysis):</h3>
        <pre>${decryptedText}</pre>
    `;
}

// To calculate letter frequency distribution
function calculateFrequency(text) {
    const freq = {};
    const cleanedText = text.toLowerCase().replace(/[^a-z]/g, '');  // To remove non-alphabetic characters

    for (let char of cleanedText) {
        freq[char] = (freq[char] || 0) + 1;
    }

    return freq;
}

// To apply Caesar cipher to the text
function applyCaesarCipher(text, shift) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let char of text) {
        if (char.match(/[a-zA-Z]/)) {
            const isUpper = char === char.toUpperCase();
            const base = isUpper ? 'A' : 'a';
            const charIndex = alphabet.indexOf(char.toLowerCase());
            const shiftedIndex = (charIndex + shift) % 26;
            const shiftedChar = alphabet[shiftedIndex];
            result += isUpper ? shiftedChar.toUpperCase() : shiftedChar;
        } else {
            result += char;  // To keep non-alphabetic characters unchanged
        }
    }

    return result;
}

// To decrypt the message using frequency analysis
function decryptWithFrequencyAnalysis(encryptedText) {
    const freqDist = calculateFrequency(encryptedText);
    
    // Sort the letters by frequency in descending order
    const sortedLetters = Object.entries(freqDist)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);

    // The most frequent letter in the ciphertext (in engish 'E')
    const mostFrequentChar = sortedLetters[0];

    // To calculate the shift by comparing it to 'E'
    const shift = calculateShift(mostFrequentChar);

    // Decrypt the message using the calculated shift
    return applyCaesarCipher(encryptedText, 26 - shift);
}

// To calculate the shift from the most frequent letter
function calculateShift(mostFrequentChar) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const assumedMostFrequentChar = 'e'; // We assume 'E' is the most frequent character in English

    const charIndex = alphabet.indexOf(mostFrequentChar.toLowerCase());
    const assumedCharIndex = alphabet.indexOf(assumedMostFrequentChar);

    // To calculate the shift
    return (charIndex - assumedCharIndex + 26) % 26;
}

// To graph the letter frequency distribution
function graphFrequencyDistribution(freqDist) {
    const labels = Object.keys(freqDist).sort();
    const data = labels.map(letter => freqDist[letter]);

    // To create the chart
    const ctx = document.getElementById('frequencyChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Letter Frequency',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}
