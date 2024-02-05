import { HTMLTemplateResult, html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { LogLevelName } from "./types";

export default class Logger {
  private _logs: HTMLTemplateResult[];

  private static _instance?: Logger;

  private constructor() {
    this._logs = [];
  }

  static get logs(): HTMLTemplateResult[] {
    return Logger.instance._logs;
  }

  static set logs(logs: HTMLTemplateResult[]) {
    Logger.instance._logs = logs;
  }

  static get instance(): Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }

    return Logger._instance;
  }

  log(
    message: string,
    options?: {
      level: LogLevelName;
      raw?: true;
    }
  ) {
    if (options?.raw) {
      this._logs.push(html`${message}`);
      return;
    }

    this._logs.push(
      html`<span class=${ifDefined(options?.level)}>${message}</span>`
    );
  }

  debug(
    message: string,
    options?: {
      raw?: true;
    }
  ) {
    this.log(message, { ...(options ?? {}), level: "debug" });
  }

  info(
    message: string,
    options?: {
      raw?: true;
    }
  ) {
    this.log(message, { ...(options ?? {}), level: "info" });
  }

  warn(
    message: string,
    options?: {
      raw?: true;
    }
  ) {
    this.log(message, { ...(options ?? {}), level: "warn" });
  }

  error(
    message: string,
    options?: {
      raw?: true;
    }
  ) {
    this.log(message, { ...(options ?? {}), level: "error" });
  }

  separator(options?: { raw?: true }) {
    if (options?.raw) {
      this._logs.push(html`---------------------------------------------`);
    }

    this._logs.push(html`<hr />`);
  }
}
