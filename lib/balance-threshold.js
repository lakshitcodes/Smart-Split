/**
 * Get the balance threshold for displaying owed/owing amounts
 * @returns {number} The minimum balance threshold (default: 0.5)
 */
export function getBalanceThreshold() {
    const threshold = parseFloat(process.env.NEXT_PUBLIC_BALANCE_THRESHOLD || '0.5');
    return isNaN(threshold) ? 0.5 : threshold;
}

/**
 * Check if a balance amount is significant enough to display
 * @param {number} balance - The balance amount to check
 * @returns {boolean} True if the balance exceeds the threshold
 */
export function isSignificantBalance(balance) {
    return Math.abs(balance) >= getBalanceThreshold();
}

/**
 * Check if a balance is significant and positive (owed to user)
 * @param {number} balance - The balance amount to check
 * @returns {boolean} True if balance is significant and positive
 */
export function isSignificantPositiveBalance(balance) {
    return isSignificantBalance(balance) && balance > 0;
}

/**
 * Check if a balance is significant and negative (user owes)
 * @param {number} balance - The balance amount to check
 * @returns {boolean} True if balance is significant and negative
 */
export function isSignificantNegativeBalance(balance) {
    return isSignificantBalance(balance) && balance < 0;
}