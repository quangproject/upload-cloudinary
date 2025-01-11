export function getFileFormat(mimeType: string): string {
  return mimeType.split("/")[1];
}

export function isJson(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch (error) {
    return false;
  }
}
