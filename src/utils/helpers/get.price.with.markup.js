const getPriceWithMarkup = (price, markupPercentage) => {
    const markup = price * ((markupPercentage ?? 1) / 100);
    return Number(price + markup).toFixed(2);
};

export default getPriceWithMarkup;