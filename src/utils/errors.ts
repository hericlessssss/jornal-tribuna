export class EditionError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'EditionError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class StorageError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'StorageError';
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof EditionError || 
      error instanceof ValidationError || 
      error instanceof StorageError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocorreu um erro inesperado';
};