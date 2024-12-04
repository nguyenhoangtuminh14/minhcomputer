
function formatCurrency(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return '0 VNĐ'; 
    }
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
}
module.exports = {
    formatCurrency
};