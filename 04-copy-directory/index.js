const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const destinationDir = path.join(__dirname, 'files-copy');

  try {
    await fs.mkdir(destinationDir, { recursive: true });

    const files = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const file of files) {
      const sourceFilePath = path.join(sourceDir, file.name);
      const destinationFilePath = path.join(destinationDir, file.name);

      if (file.isDirectory()) {
        await copyDir(sourceFilePath, destinationFilePath);
      } else {
        await fs.copyFile(sourceFilePath, destinationFilePath);
      }
    }

    const destinationFiles = await fs.readdir(destinationDir);
    for (const file of destinationFiles) {
      if (!files.some((f) => f.name === file)) {
        await fs.unlink(path.join(destinationDir, file));
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

copyDir();
