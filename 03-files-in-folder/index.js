const fs = require('fs/promises');
const path = require('path');

const secretFolderPath = path.join(__dirname, 'secret-folder');

async function displayFileInfo() {
  try {
    const files = await fs.readdir(secretFolderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(secretFolderPath, file.name);

        const stats = await fs.stat(filePath);

        const fileExt = path.extname(file.name).slice(1);
        const fileName = path.basename(file.name, '.' + fileExt);
        const fileSize = (stats.size / 1024).toFixed(3);

        console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

displayFileInfo();
