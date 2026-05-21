export const MOCK_LOADING_MS = 750;

export async function mockServerDelay(ms: number = MOCK_LOADING_MS): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
}
