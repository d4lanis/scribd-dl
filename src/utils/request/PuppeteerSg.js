import puppeteer from 'puppeteer-core'

class PuppeteerSg {
  constructor() {
    if (!PuppeteerSg.instance) {
      PuppeteerSg.instance = this;
      process.on('exit', () => {
        this.close();
      });
    }
    return PuppeteerSg.instance;
  }

  /**
   * Launch a browser
   */
  async launch() {
    const browserWSEndpoint = process.env.BROWSER_WS_ENDPOINT;
    try {
      if (browserWSEndpoint) {
        console.log(`Connecting to remote browser: ${browserWSEndpoint}`);
        this.browser = await puppeteer.connect({
          browserWSEndpoint: browserWSEndpoint
        });
      } else {
        // Fallback for local development - requires a local chrome installation
        // You might need to specify executablePath if it's not found automatically
        const isCI = process.env.CI === 'true';
        const args = [];
        if (isCI) {
          args.push('--no-sandbox', '--disable-setuid-sandbox');
        }

        // Try to find a local chrome installation
        // On Linux, it might be at /usr/bin/google-chrome or /usr/bin/chromium-browser
        // For now, we'll let puppeteer-core try to find it or user must provide executablePath via env
        const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';

        this.browser = await puppeteer.launch({
          headless: "new",
          defaultViewport: null,
          executablePath,
          args
        });
      }
    } catch (e) {
      console.error("Failed to launch browser:", e);
      if (!process.env.BROWSER_WS_ENDPOINT) {
        throw new Error(`Failed to launch local browser. If running in Appwrite Cloud, you MUST set 'BROWSER_WS_ENDPOINT' to a remote browser instance (e.g. Browserless.io). Error: ${e.message}`);
      }
    }
  }

  /**
   * New a page
   * @param {string} url 
   * @returns 
   */
  async getPage(url) {
    if (!this.browser) {
      await this.launch()
    }
    let page = await this.browser.newPage()
    await page.goto(url, {
      waitUntil: "load",
    })
    return page
  }

  /**
   * Close the browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const puppeteerSg = new PuppeteerSg()
