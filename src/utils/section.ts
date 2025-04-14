
const MAX_SECTIONS = 9;

export const getSection = (index: number) => {
    return Math.max(1, Math.min(index, MAX_SECTIONS));
};

/*
 * Returns the starting scroll percentage for a specific section
 * @param {number} index - The index of the section
 * @returns {number}
 */
export const getSectionPercentage = (index: number) => {
    const section = getSection(index);
    return ((section - 1) / MAX_SECTIONS) * 100;
};

export const getSectionEndPercentage = (index: number) => {
    const section = getSection(index);
    return (section / MAX_SECTIONS) * 100;
};

/*
 * Returns the scroll percentage for a specific section
 * @param {number} index - The index of the section
 * @param {number} percentage - The scroll percentage (0-100)
 * @returns {number}
 */
export const getLocalSectionPercentage = (index: number, percentage: number) => {
    const section = getSection(index);

    const startPercentage = getSectionPercentage(section);
    if (percentage < startPercentage) return 0;
    const endPercentage = getSectionEndPercentage(section);
    if (percentage >= endPercentage) return 100;

    return ((percentage - startPercentage) / (endPercentage - startPercentage)) * 100;
};

/*
 * Returns the scroll percentage per section
 * @param {number} percentage - The scroll percentage (0-100)
 * @returns {number} - The scroll percentage per section (0-100)
 */
export const getGlobalPercentagePerSection = (percentage: number = 100) => {
    return (percentage / 100 / MAX_SECTIONS) * 100;
};
