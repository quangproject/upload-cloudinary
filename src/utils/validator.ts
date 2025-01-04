import { ValidationError } from "../type";

export class InputValidator {
  private errors: ValidationError[] = [];

  constructor(private data: Record<string, any>) {}

  validateRequired(field: string): InputValidator {
    if (!this.data[field] || this.data[field].trim() === "") {
      this.errors.push({ field, message: `${field} is required.` });
    }
    return this;
  }

  validateLength(field: string, min: number, max: number): InputValidator {
    const value = this.data[field];
    if (value && (value.length < min || value.length > max)) {
      this.errors.push({
        field,
        message: `${field} must be between ${min} and ${max} characters.`
      });
    }
    return this;
  }

  validatePattern(field: string, regex: RegExp): InputValidator {
    const value = this.data[field];
    if (value && !regex.test(value)) {
      this.errors.push({ field, message: `${field} is invalid.` });
    }
    return this;
  }

  validateEnum(field: string, validValues: any[]): InputValidator {
    const value = this.data[field];
    if (value && !validValues.includes(value)) {
      this.errors.push({
        field,
        message: `${field} must be one of ${validValues.join(", ")}.`
      });
    }
    return this;
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }
}
