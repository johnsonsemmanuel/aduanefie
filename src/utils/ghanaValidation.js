// Ghana NIA card format: GHA-XXXXXXXXX-X (alphanumeric, 15 chars total)
export const GHANA_CARD_REGEX = /^GHA-[0-9A-Z]{9}-[0-9]$/;

export const validateGhanaCard = (value) =>
  GHANA_CARD_REGEX.test(value?.toUpperCase().trim());
