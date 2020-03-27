export const reactVirtualizedRecalculationDelay = 400
// this needs to be a longer delay than reactVirtualizedRecalculationDelay
// to avoid marking rows as read that aren't ready yet
export const readRowDelay = reactVirtualizedRecalculationDelay + 50

export const typingThrottlingDelay = 5000

export const reconnectionDelay = 60000
