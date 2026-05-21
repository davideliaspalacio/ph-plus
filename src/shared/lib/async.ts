/** Helpers async cortos compartidos por toda la app. */

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Latencia aleatoria realista para los repos mock (simula red). */
export const fakeLatency = (min = 150, max = 450): Promise<void> =>
  sleep(min + Math.random() * (max - min));
