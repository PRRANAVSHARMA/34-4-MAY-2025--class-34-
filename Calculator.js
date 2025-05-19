function playClick() {
    const clickSound = document.getElementById('clickSound');
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => {
            // Handle autoplay restrictions gracefully
            console.log('Audio playback failed:', err);
        });
    }
}

function append(value) {
    const display = document.getElementById('display');
    const lastChar = display.value.slice(-1);
    const operators = "+-*/^%";
    if (
        operators.includes(value) &&
        (display.value === "" || operators.includes(lastChar))
    ) return;

    playClick();
    display.value += value;
}

function clearDisplay() {
    playClick();
    document.getElementById('display').value = '';
}

function backspace() {
    playClick();
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

function calculate() {
    playClick();
    const display = document.getElementById('display');
    let input = display.value;

    try {
        // Fix replacements for proper calculation
        input = input.replace(/√/g, 'sqrt')
            .replace(/log\(/g, 'log10(')
            .replace(/%/g, '/100');
        // Note: ^ is the correct operator for exponentiation in math.js

        const result = math.evaluate(input);

        // Format the result to avoid extremely long decimals
        const formattedResult = typeof result === 'number' ?
            (Math.abs(result) < 1e-10 || Math.abs(result) > 1e10 ?
                result.toExponential(4) :
                parseFloat(result.toFixed(8)).toString()) :
            result.toString();

        display.value = formattedResult;
        addToHistory(input + " = " + formattedResult);
    } catch (error) {
        console.error("Calculation error:", error);
        display.value = 'Error';
    }
}

function addToHistory(entry) {
    const historyList = document.getElementById('history-list');
    const li = document.createElement('li');
    li.textContent = entry;
    li.setAttribute('tabindex', '0'); // Make history items focusable
    historyList.prepend(li);

    // Limit history to 10 items to prevent performance issues
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

function clearHistory() {
    playClick();
    document.getElementById('history-list').innerHTML = '';
}

function copyResult() {
    const display = document.getElementById('display');
    if (display.value) {
        navigator.clipboard.writeText(display.value)
            .then(() => {
                // Create and show a temporary notification instead of alert
                const notification = document.createElement('div');
                notification.className = 'copy-notification';
                notification.textContent = 'Copied to clipboard!';
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.remove();
                }, 2000);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
                alert('Failed to copy to clipboard!');
            });
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    // Store preference in localStorage
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode);
}

// Handle keyboard input
document.addEventListener('keydown', function (e) {
    const key = e.key;

    if ('0123456789.+-*/()%^'.includes(key)) {
        append(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});

// Initialize dark mode from saved preference
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
    }
});
