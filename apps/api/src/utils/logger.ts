import format from "date-fns/format";

class Logger {
  get now() {
    const d = Date.now();
    return format(d, "yyyy-MM-dd, HH:mm:ss");
  }

  log(type: string, message: string) {
    console.log(`[${this.now}][${type}]: ${message}`);
  }
}

export const logger = new Logger();
