import fs from 'fs/promises';
import path from 'path';
import mime from 'mime-types';

export default async function findTemplate(product, type, i) {
  let filePath = null;

  switch (type) {
    case 'cert':
      filePath = `./templates/${product}/${type}${i}.jpg`;
      break;
    case 'audio':
      filePath = `./templates/${product}/${type}${i}.ogg`;
      break;
    case 'video':
      filePath = `./templates/${product}/${type}${i}.mp4`;
      break;
    case 'pic':
      filePath = `./templates/${product}/${type}${i}.webp`;
      break;
    default:
      throw new Error(`Unknown type "${type}"`);
  };

  const absolutePath = path.resolve(filePath);

  try {
    await fs.access(absolutePath);

    const fileContent = await fs.readFile(absolutePath);
    const mimetype = mime.lookup(absolutePath) || 'application/octet-stream';
    const filename = path.basename(absolutePath);

    return {
      filename,
      mimetype,
      content: fileContent,
    };
  } catch (error) {
    throw new Error(`Failed to access or read file at ${absolutePath}: ${error.message}`);
  }
};
