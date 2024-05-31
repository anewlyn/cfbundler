export async function getBundle() {
  return await fetch('/api/loop/bundle').then((res) => res.json());
}
