const calculateNetAmount = (amount) => {
    const fixedFee = 0.30;
    const percentage = 0.035;
    const totalFee = (parseFloat(amount) * percentage) + fixedFee;
    return {
        fee: totalFee.toFixed(2),
        net: (amount - totalFee).toFixed(2),
    };
};

export default calculateNetAmount;