import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (i < retries - 1) {
        console.log(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
        await sleep(delay * (i + 1)); // Exponential backoff
      }
    }
  }
  throw lastError;
}
