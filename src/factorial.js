export function factorial(number) {
  if (!Number.isInteger(number) || number < 0) {
    return undefined;
  }
  if (number === 0 || number === 1) {
    return 1;
  }

  return number * factorial(number - 1);
}
