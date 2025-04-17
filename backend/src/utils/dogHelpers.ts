export function getAgeInYears(birthday: Date): number {
    const ageDiff = Date.now() - new Date(birthday).getTime();
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  }
  