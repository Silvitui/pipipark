
import { getAgeInYears } from './dogHelpers';
import { NEGATIVE_TRAITS, POSITIVE_TRAITS } from './config/traits';
import { DogType } from './types/types';

export function calculateCompatibility(dog1: DogType, dog2: DogType) {
  let score = 0;
  let reasons: string[] = [];

  // Castración
  if (dog1.castrated && dog2.castrated) {
    score += 20;
    reasons.push('Ambos están castrados.');
  } else if (dog1.castrated || dog2.castrated) {
    score += 10;
    reasons.push('Uno está castrado.');
  } else {
    reasons.push('Ninguno está castrado.');
  }

  // Sexo
  if (dog1.gender !== dog2.gender) {
    score += 20;
    reasons.push('Son de distinto sexo.');
  } else if (dog1.castrated && dog2.castrated) {
    score += 15;
    reasons.push('Mismo sexo, pero castrados.');
  } else {
    score -= 10;
    reasons.push('Mismo sexo y no castrados.');
  }

  // Edad
  const age1 = getAgeInYears(dog1.birthday);
  const age2 = getAgeInYears(dog2.birthday);
  const diff = Math.abs(age1 - age2);

  if (diff <= 3) {
    score += 15;
    reasons.push('Edades similares.');
  } else if ((age1 < 2 && age2 > 8) || (age2 < 2 && age1 > 8)) {
    score -= 10;
    reasons.push('Uno es muy joven y el otro mayor.');
  } else {
    score += 5;
    reasons.push('Edades compatibles.');
  }

  // Tamaño
  const sizeCombo = [dog1.size, dog2.size].sort().join('-');
  const compatibleSizes = [
    'mediano-pequeño',
    'grande-mediano',
    'mediano-mediano',
    'grande-grande',
    'pequeño-pequeño',
  ];

  if (dog1.size === dog2.size) {
    score += 15;
    reasons.push('Tienen el mismo tamaño.');
  } else if (compatibleSizes.includes(sizeCombo)) {
    score += 10;
    reasons.push('Tamaños compatibles.');
  } else {
    score -= 10;
    reasons.push('Tamaños muy distintos.');
  }

  // Personalidad
  const commonTraits = dog1.personality.filter((t: string) =>
    dog2.personality.includes(t)
  );

  const hasNegative = commonTraits.some((t: string) =>
    NEGATIVE_TRAITS.includes(t)
  );

  const hasPositive = commonTraits.some((t: string) =>
    POSITIVE_TRAITS.includes(t)
  );

  if (commonTraits.length >= 3) {
    score += 10;
    reasons.push('Comparten varias características.');
  }
  if (hasPositive) {
    score += 5;
    reasons.push('Tienen rasgos positivos en común.');
  }
  if (hasNegative) {
    score -= 10;
    reasons.push('Coinciden en rasgos conflictivos.');
  }

  const finalScore = Math.max(0, Math.min(score, 100));

  return {
    score: finalScore,
    summary: reasons.join(' ')
  };
}
