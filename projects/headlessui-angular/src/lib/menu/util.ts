
let id = 1;
export function generateId(): number {
  return id++;
}

/* for testing only */
export function resetIdCounter() {
  id = 1;
}