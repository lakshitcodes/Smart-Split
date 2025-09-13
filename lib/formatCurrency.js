export const formatCurrency = (amount) => {
    return "₹" +
        Math.abs(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
}