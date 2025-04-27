const getPriceWithMarkup = (price, markup) => {
    const markup = price * ((markup ?? 1) / 100);
    return Number(price + markup).toFixed(2);
};

export default getPriceWithMarkup;