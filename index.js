const config = require('./config')
const binance = require('node-binance-api')().options({
    APIKEY: config.API_KEY,
    APISECRET: config.SECRET_KEY,
    useServerTime: true
});

setInterval(function() {
    binance.balance((error, balances) => {
        if ( error ) return console.error(error);
        const total = parseFloat(balances.USDT.onOrder) + parseFloat(balances.USDT.available) + parseFloat(balances.TUSD.onOrder) + parseFloat(balances.TUSD.available)
        console.log("TOTAL BALANCE : ", total, "USD")
        console.log("INITIAL BALANCE : ", config.INITIAL_INVESTMENT, "USD")
        console.log("GAINS : ", total - config.INITIAL_INVESTMENT, "USD")
        
        const { BUY_PRICE, SELL_PRICE } = config

        // TUSD BUY
        if (balances.USDT.available > 20) {
            binance.buy("TUSDUSDT", ((balances.USDT.available - 0.1) / BUY_PRICE).toFixed(2), BUY_PRICE);
        }
    
        // TUSD SELL
        if (balances.TUSD.available > 20) {
            binance.sell("TUSDUSDT", (balances.TUSD.available - 0.1).toFixed(2), SELL_PRICE);
        }
    });
}, 3000)
