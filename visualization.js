// Initialize gspcDataFetched as false
let gspcDataFetched = false;

// Function to initiate the stock search process. It retrieves the ticker value from the input and calls functions to fetch stock data
function searchStock() {
    gspcDataFetched = false;
    const ticker = document.getElementById('tickerInput').value;
    getStockData(ticker);
    updateDialAndInfoBox(ticker);
}

// Function to fetch stock data for the'searched for' ticker via a request to the server
function getStockData(ticker) {
    const uppercaseTicker = ticker.toUpperCase(); // Convert ticker to uppercase
    axios.get(`http://localhost:5000/api/data/${uppercaseTicker}`)
        .then(response => {
            const responseData = response.data;
            console.log('Response Data:', responseData);

            if (Array.isArray(responseData) && responseData.length > 0) {
                // Process the data for the chart
                processChartData(responseData, uppercaseTicker);
            } else {
                // Ticker not found in the database
                displayTickerNotFoundError();
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Display an error in the html if a ticker is not found
function displayTickerNotFoundError() {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.style.display = 'block'; 
}

// Function to process the chart data for he'searched for' ticker  
function processChartData(data, ticker) {
    // Extract the dates and close prices from the data
    const dates = data.map(item => item.Date);
    const closePrices = data.map(item => parseFloat(item.Close));

    const ctx = document.getElementById('stockChart').getContext('2d');
    if (window.myChart instanceof Chart) {
        window.myChart.destroy(); // Destroy the old chart instance if it exists
    }

    // Define chart options
    const chartOptions = {
        scales: {
            x: {
                time: {
                    parser: 'm/dd/yyyy',
                    unit: 'day',
                },
                title: {
                    display: true,
                    text: '2023'
                },
            },
            y: {
                type: 'linear',
                display: true,
                position: 'right',
                id: 'y-axis-1',
                grid: { display: false },
                ticks: { display: false },                
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'left',
                id: 'y-axis-2',
                grid: { display: false },
                ticks: { display: false },
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    // Create a new chart instance
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `(${ticker}) Close Price`, // Use uppercase ticker
                data: closePrices,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
                yAxisID: 'y-axis-1', // Link this dataset to the first y-axis
                ticks: {
                display: true,
            },
            }]
        },
        options: chartOptions
    });

    function removeDuplicates(array, key) {
        return array.filter((item, index, self) =>
            index === self.findIndex((obj) => obj[key] === item[key])
        );
    }

    // Fetch and add '^GSPC' data if necessary
    if (ticker !== '^GSPC' && !gspcDataFetched) {
        fetchGSPCData();
    }

    function fetchGSPCData() {
        axios.get(`http://localhost:5000/api/data/^GSPC`)
            .then(response => {
                const responseData = response.data;

                // Filter and remove duplicate entries with the same date for ^GSPC data
                const uniqueData = removeDuplicates(responseData, 'Date');
                const gspcClosePrices = uniqueData.map(item => parseFloat(item.Close));

                // Add the second dataset for '^GSPC' to the chart
                window.myChart.data.datasets.push({
                    label: 'S&P Close Price',
                    data: gspcClosePrices,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false,
                    yAxisID: 'y-axis-2', // Link this dataset to the second y-axis
                });

                // Update the chart
                window.myChart.update();
            })
            .catch(error => {
                console.error('Error fetching ^GSPC data:', error);
            });
        gspcDataFetched = true;
    }
}

// Function to add event listeners when the html document is fully loaded
function addEventListeners() {
    const optionsSelect = document.getElementById('optionsSelect');
    optionsSelect.addEventListener('change', function () {
        updateDialAndInfoBox(document.getElementById('tickerInput').value);
    });
}

// Add an event listener for the 'DOMContentLoaded' event
document.addEventListener('DOMContentLoaded', addEventListeners);

function updateDialAndInfoBox(ticker) {
    const selectedOption = document.getElementById('optionsSelect').value;
    axios.get(`http://localhost:5000/api/data/${ticker.toUpperCase()}`)
        .then(response => {
            const responseData = response.data;
            if (responseData && responseData.length > 0) {
                const mostRecentData = responseData[responseData.length - 1];
                let comparisonValue;
                let comparisonText;

                switch (selectedOption) {
                    case '52W High':
                        comparisonValue = mostRecentData['52WHigh'];
                        comparisonText = '52-Week High';
                        break;
                    case '52W Low':
                        comparisonValue = mostRecentData['52WLow'];
                        comparisonText = '52-Week Low';
                        break;
                    case '200 MA':
                        comparisonValue = mostRecentData['200MA'];
                        comparisonText = '200 Day Moving Average';
                        break;
                    case 'Price Target':
                        comparisonValue = mostRecentData['PriceTarget'];
                        comparisonText = 'Price Target';
                        break;
                    default:
                        comparisonValue = '';
                        comparisonText = '';
                        break;
                }

                const indicatorElement = document.getElementById('indicator');
                const stockPrice = mostRecentData.StockPrice;

                // Determine whether to display 'BUY' or 'SELL'
                if (stockPrice > comparisonValue) {
                    indicatorElement.textContent = 'SELL';
                    indicatorElement.style.color = 'red';
                } else {
                    indicatorElement.textContent = 'BUY';
                    indicatorElement.style.color = 'green';
                }

                // Get the additional information based on the selected option
                const additionalInfo = getAdditionalInfo(selectedOption);

                // Update the info box with separate lines
                const infoBox = document.getElementById('infoBox');
                infoBox.innerHTML = `01/26/24 Stock Price: ${stockPrice}<br>${comparisonText} Price: ${comparisonValue}<br>${additionalInfo}`;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to retrieve additional information based on the selected technical indicator
function getAdditionalInfo(selectedOption) {
    switch (selectedOption) {
        case '52W High':
            return "52-Week High is the highest price the stock has reached in the past year.";
        case '52W Low':
            return "52-Week Low is the lowest price the stock has reached in the past year.";
        case '200 MA':
            return "The 200-day moving average is a long-term trend indicator.";
        case 'Price Target':
            return "Analyst price target represents the projected stock price by analysts.";
        default:
            return "Select a technical indicator to see information.";
    }
}
