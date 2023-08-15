export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function yieldFn() {
  return sleep(0);
}
