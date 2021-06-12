export function parseCategoryName(value: string): string {
  // 1st replace: replace space with '-'
  // 2nd replace: replace multiple '-' with 1 '-'
  // 3rd replace: replace a '-' in the beginning with nothing.
  // 4th replace: remove special characters
  // thanks to: https://youtu.be/3tG1jUQbuSI?t=510

  return value
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-/, "")
    .replace(/[!?&²³,;:%£*$^'"()_M+=[\]/]/g, "")
    .toLowerCase();
}
