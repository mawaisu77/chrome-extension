export function applyTransform(value: string, transform: "none" | "uppercase" | "trim"): string {
  if (transform === "uppercase") {
    return value.toUpperCase();
  }
  if (transform === "trim") {
    return value.trim();
  }
  return value;
}
