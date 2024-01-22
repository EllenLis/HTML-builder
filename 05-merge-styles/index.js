const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

  try {
    const files = await fs.readdir(stylesDir, { withFileTypes: true });
    let stylesContent = '';

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesDir, file.name);
        const content = await fs.readFile(filePath, 'utf8');
        stylesContent += content + '\n';
      }
    }

    await fs.writeFile(bundlePath, stylesContent);
    console.log('Styles merged into bundle.css successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

mergeStyles();
