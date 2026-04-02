export abstract class BaseScraper {
  protected maxRetries = 3;
  protected retryDelay = 1000;

  protected async fetchWithRetry(url: string, options?: RequestInit): Promise<Response> {
    let lastError: Error | null = null;

    for (let i = 0; i < this.maxRetries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            "User-Agent": "GameCodeHub/1.0 (code aggregator)",
            ...options?.headers,
          },
        });

        if (response.ok) return response;

        if (response.status === 429) {
          // Rate limited - wait longer
          await this.sleep(this.retryDelay * (i + 1) * 2);
          continue;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        lastError = error as Error;
        if (i < this.maxRetries - 1) {
          await this.sleep(this.retryDelay * (i + 1));
        }
      }
    }

    throw lastError || new Error("Failed after retries");
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  abstract scrape(): Promise<ScrapedCode[]>;
}

export interface ScrapedCode {
  code: string;
  rewards: string;
  source: string;
  source_url?: string;
  region: string;
  expires_at?: string;
}
