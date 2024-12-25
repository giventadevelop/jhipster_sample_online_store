import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LogService {
  private source: string;

  constructor() {
    this.source = 'Application';
  }

  static create(source: string): LogService {
    const logger = new LogService();
    logger.source = source;
    return logger;
  }

  debug(message: string, ...args: any[]): void {
    if (!environment.production) {
      // eslint-disable-next-line no-console
      console.debug(`[${this.source}] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    // eslint-disable-next-line no-console
    console.info(`[${this.source}] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    // eslint-disable-next-line no-console
    console.warn(`[${this.source}] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    // eslint-disable-next-line no-console
    console.error(`[${this.source}] ${message}`, ...args);
  }
}

export const Log = LogService;
