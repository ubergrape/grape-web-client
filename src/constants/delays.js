export const reactVirtualizedRecalculationDelay = 400
// this needs to be a longer delay than reactVirtualizedRecalculationDelay
// to avoid marking rows as read that aren't ready yet
export const readRowDelay = reactVirtualizedRecalculationDelay + 10
