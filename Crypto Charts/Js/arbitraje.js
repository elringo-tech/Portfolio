const URL = "http://127.0.0.1:5000";
//Access-Control-Allow-Origin: *;
//***** cuenta regresiva actualizacion*/////////////
function regresiva() {
    var timeLeft = 30;
    var elem = document.getElementById('Timer');
    var timerId = setInterval(countdown, 1000);
    function countdown() {
        if (timeLeft == 0) {
            timeLeft = 30;
            //clearTimeout(timerId);
            //document.write(`${timeLeft}`);
        } else {
            elem.innerHTML = 'Actualizando en ' + timeLeft + ' segundos';
            timeLeft--;
        }
    }
}
//******************************************* */


function fetchCryptoPrice(cryptoSymbol, elementId) {
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoSymbol}&vs_currencies=usd`)
        .then(response => response.json())
        .then(data => {
            const price = data[cryptoSymbol].usd;
            const priceElement = document.getElementById(elementId);
            priceElement.textContent = `$${price}`;
        })
        .catch(error => {
            console.error(`Error fetching ${cryptoSymbol} price: `, error);
        });
}

/*function startRealTimeUpdates(interval) {
    // Fetch and update Bitcoin price
    fetchCryptoPrice("bitcoin", "bitcoinPrice");
    fetchCryptoPrice("ethereum", "ethereumPrice");
    fetchCryptoPrice("polkadot", "polkadotPrice");
    fetchCryptoPrice("dai", "daiPrice");
    fetchCryptoPrice("dogecoin", "dogecoinPrice");
    fetchCryptoPrice("uniswap", "uniswapPrice");
    fetchCryptoPrice("binancecoin", "binancecoinPrice");
    fetchCryptoPrice("tether", "tetherPrice");
    fetchCryptoPrice("pancakeswap-token", "pancakeswap-tokenPrice");
    fetchCryptoPrice("usd-coin", "usd-coinPrice");
    fetchCryptoPrice("cardano", "cardanoPrice");
    fetchCryptoPrice("matic-network", "matic-networkPrice");
    // fetchCryptoPrice("cryptosymbol", "elementId");

    // Set up an interval to update the prices every 'interval' milliseconds
    setInterval(() => {
        fetchCryptoPrice("bitcoin", "bitcoinPrice");
        fetchCryptoPrice("ethereum", "ethereumPrice");
        fetchCryptoPrice("polkadot", "polkadotPrice");
        fetchCryptoPrice("dai", "daiPrice");
        fetchCryptoPrice("dogecoin", "dogecoinPrice");
        fetchCryptoPrice("uniswap", "uniswapPrice");
        fetchCryptoPrice("binancecoin", "binancecoinPrice");
        fetchCryptoPrice("tether", "tetherPrice");
        fetchCryptoPrice("pancakeswap-token", "pancakeswap-tokenPrice");
        fetchCryptoPrice("usd-coin", "usd-coinPrice");
        fetchCryptoPrice("cardano", "cardanoPrice");
        fetchCryptoPrice("matic-network", "matic-networkPrice");
        // Fetch and update prices for other cryptocurrencies here
    }, interval);
}*/
//startRealTimeUpdates(30000);/*Agregar cuenta regresiva actualizando en.... x segundos*/
/***********************************************************************/
/********************************************************************** */
//Funcion para dar formato a eje x del grafico */
/*Tengo que hacer esto porque sino me manda en horas cuando el span de tiempo es de meses y no queda bien */
function formatTimestamps(timestamps) {
    const currentTime = new Date();
    const timeDifferenceInDays = (currentTime - timestamps[0]) / (1000 * 60 * 60 * 24);

    if (timeDifferenceInDays <= 2) {

        return timestamps.map(timestamp => {
            const options = { hour: 'numeric', minute: '2-digit' };
            return new Intl.DateTimeFormat('en-US', options).format(timestamp);
        });
    } else {

        return timestamps.map(timestamp => {
            const options = { month: 'short', day: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(timestamp);
        });
    }
}
/********************************************************************** */
/********************************************************************** */
let grafico; /*creo variable global para grafico*/
function displayChart() {
    if (grafico) {
        grafico.destroy();
    }
    const selectedCrypto = document.getElementById("cryptoSelect").value;
    const dias = document.getElementById("dias").value;//traigo los dias a desplegar desde el index

    fetch(`https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart?vs_currency=usd&days=${dias}`)
        .then(response => response.json())
        .then(data => {
            const chartData = data.prices.map(price => price[1]);
            //const labels = data.prices.map(price => new Date(price[0]));
            const timestamps = data.prices.map(price => new Date(price[0]));

            const formattedLabels = formatTimestamps(timestamps)

            const hourMinuteLabels = timestamps.map(timestamp => {
                const options = { hour: 'numeric', minute: '2-digit' };
                return new Intl.DateTimeFormat('en-US', options).format(timestamp);
            });
            // Create a Chart.js chart
            var ctx = document.getElementById("cryptoChart").getContext("2d");
            grafico = new Chart(ctx, {
                type: "line",
                data: {
                    labels: formattedLabels,//hourMinuteLabels,
                    datasets: [
                        {
                            label: `Precio de ${selectedCrypto.toUpperCase()} en (usd)`,
                            data: chartData,
                            borderColor: "rgb(0, 51, 102)",
                            borderWidth: 1,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    // mode:"no-cors",
                    pointStyle: false,

                    // backgroundColor: white,
                    /*scales: {
                        x: {
                            type: 'time', // Set the X-axis scale type to 'time'
                            time: {
                                unit: 'minute', // Display the time in minutes
                                displayFormats: {
                                    minute: 'h:mm a' // Customize the time format (e.g., "2:30 PM")
                                }
                            }
                        }
                    }*/
                }
            });
        })
        .catch(error => {
            console.error("Error fetching chart data: ", error);
        });
}
/*Segunda funcion para timestamps de grafico 2*/
function formatTimestamps2(timestamps2) {
    const currentTime = new Date();
    const timeDifferenceInDays = (currentTime - timestamps2[0]) / (1000 * 60 * 60 * 24);

    if (timeDifferenceInDays <= 2) {
        // Display time in "hours and minutes"
        return timestamps2.map(timestamp2 => {
            const options = { hour: 'numeric', minute: '2-digit' };
            return new Intl.DateTimeFormat('en-US', options).format(timestamp2);
        });
    } else {
        // Display time in "Month Day" format (e.g., "October 1")
        return timestamps2.map(timestamp2 => {
            const options = { month: 'short', day: 'numeric' };
            return new Intl.DateTimeFormat('en-US', options).format(timestamp2);
        });
    }
}
/**********************************************/
/*Segundo grafico*/
let grafico2; /*creo variable global para grafico*/
function displayChart2() {
    if (grafico2) {
        grafico2.destroy();
    }
    const selectedCrypto2 = document.getElementById("cryptoSelect2").value;
    const dias2 = document.getElementById("dias2").value;//traigo los dias a desplegar desde el index

    fetch(`https://api.coingecko.com/api/v3/coins/${selectedCrypto2}/market_chart?vs_currency=usd&days=${dias2}`)
        .then(response => response.json())
        .then(data => {
            const chartData2 = data.prices.map(price => price[1]);
            //const labels = data.prices.map(price => new Date(price[0]));
            const timestamps2 = data.prices.map(price => new Date(price[0]));

            const formattedLabels = formatTimestamps2(timestamps2)

            const hourMinuteLabels = timestamps2.map(timestamp2 => {
                const options = { hour: 'numeric', minute: '2-digit' };
                return new Intl.DateTimeFormat('en-US', options).format(timestamp2);
            });

            var ctx2 = document.getElementById("cryptoChart2").getContext("2d");
            grafico2 = new Chart(ctx2, {
                type: "line",
                data: {
                    labels: formattedLabels,//hourMinuteLabels,
                    datasets: [
                        {
                            label: `Precio de ${selectedCrypto2.toUpperCase()} en (usd)`,
                            data: chartData2,
                            borderColor: "rgb(0, 164, 255)",
                            borderWidth: 1,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    // mode:"no-cors",
                    pointStyle: false,
                    /*scales: {
                        x: {
                            type: 'time', // Set the X-axis scale type to 'time'
                            time: {
                                unit: 'minute', // Display the time in minutes
                                displayFormats: {
                                    minute: 'h:mm a' // Customize the time format (e.g., "2:30 PM")
                                }
                            }
                        }
                    }*/
                }
            });
        })
        .catch(error => {
            console.error("Error fetching chart data: ", error);
        });
}