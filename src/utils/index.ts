export function getFileFormat(mimeType: string): string {
  return mimeType.split("/")[1];
}
