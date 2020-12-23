const socket = io();


socket.on('connect', () => {
    console.log("connected");
});


socket.on('price-change', (stock) => {
    if (stock.code) {
        let element = document.querySelector(`#${stock.code}`);
        if (element) {
            element.innerHTML = stock.price
        }
    }
});
