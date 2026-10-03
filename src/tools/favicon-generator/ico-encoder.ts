/**
 * Encodes an array of PNG ArrayBuffers into a valid multi-image .ICO file format.
 * 
 * ICO Format Specification:
 * - Header (6 bytes): [0, 0, 1, 0, count, 0]
 * - Directory (16 bytes per image): width, height, colors, reserved, planes, bpp, size, offset
 * - Image Data: Raw PNG bytes (supported by all modern browsers).
 * 
 * @param pngBuffers Array of objects containing the PNG ArrayBuffer and its dimensions
 * @returns An ArrayBuffer containing the fully encoded .ICO file
 */
export async function createIcoFromPngs(
  pngImages: { buffer: ArrayBuffer; width: number; height: number }[]
): Promise<ArrayBuffer> {
  const HEADER_SIZE = 6;
  const DIR_ENTRY_SIZE = 16;
  
  const numImages = pngImages.length;
  const directorySize = numImages * DIR_ENTRY_SIZE;
  
  // Calculate total file size
  let totalDataSize = 0;
  for (const img of pngImages) {
    totalDataSize += img.buffer.byteLength;
  }
  
  const totalFileSize = HEADER_SIZE + directorySize + totalDataSize;
  const outBuffer = new ArrayBuffer(totalFileSize);
  const dataView = new DataView(outBuffer);
  const uint8View = new Uint8Array(outBuffer);
  
  // 1. Write ICO Header
  dataView.setUint16(0, 0, true); // Reserved, must be 0
  dataView.setUint16(2, 1, true); // Image type: 1 for ICO
  dataView.setUint16(4, numImages, true); // Number of images
  
  let currentOffset = HEADER_SIZE + directorySize;
  
  // 2. Write Directory Entries
  for (let i = 0; i < numImages; i++) {
    const img = pngImages[i];
    const dirOffset = HEADER_SIZE + (i * DIR_ENTRY_SIZE);
    
    // Width and Height (0 means 256 pixels)
    dataView.setUint8(dirOffset + 0, img.width >= 256 ? 0 : img.width);
    dataView.setUint8(dirOffset + 1, img.height >= 256 ? 0 : img.height);
    
    // Color palette count (0 if no palette / true color)
    dataView.setUint8(dirOffset + 2, 0);
    // Reserved
    dataView.setUint8(dirOffset + 3, 0);
    // Color planes (usually 1)
    dataView.setUint16(dirOffset + 4, 1, true);
    // Bits per pixel (32 for RGBA PNG)
    dataView.setUint16(dirOffset + 6, 32, true);
    
    // Size of the image data in bytes
    const size = img.buffer.byteLength;
    dataView.setUint32(dirOffset + 8, size, true);
    // Offset from the beginning of the file to the image data
    dataView.setUint32(dirOffset + 12, currentOffset, true);
    
    // 3. Write Image Data
    const imgUint8 = new Uint8Array(img.buffer);
    uint8View.set(imgUint8, currentOffset);
    
    currentOffset += size;
  }
  
  return outBuffer;
}
