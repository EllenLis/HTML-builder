const fs = require('fs/promises');
const path = require('path');

async function buildPage() {
  const projectDistPath = path.join(__dirname, 'project-dist');
  await fs.mkdir(projectDistPath, { recursive: true });

  await compileHtml();
  await compileCss();
  await copyAssets(
    path.join(__dirname, 'assets'),
    path.join(__dirname, 'project-dist', 'assets'),
  );
}

async function compileHtml() {
  const templatePath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');
  let templateContent = await fs.readFile(templatePath, 'utf-8');

  const componentTags = templateContent.match(/{{\w+}}/g) || [];

  for (const tag of componentTags) {
    const tagName = tag.replace(/{{|}}/g, '');
    const componentFilePath = path.join(componentsPath, `${tagName}.html`);

    if (await fileExists(componentFilePath)) {
      const componentContent = await fs.readFile(componentFilePath, 'utf-8');
      templateContent = templateContent.replace(tag, componentContent);
    }
  }

  const distHtmlPath = path.join(__dirname, 'project-dist', 'index.html');
  await fs.writeFile(distHtmlPath, templateContent);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function compileCss() {
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

async function copyAssets(sourceDir, destinationDir) {
  try {
    await fs.mkdir(destinationDir, { recursive: true });

    const files = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const file of files) {
      const sourceFilePath = path.join(sourceDir, file.name);
      const destinationFilePath = path.join(destinationDir, file.name);

      if (file.isDirectory()) {
        await copyAssets(sourceFilePath, destinationFilePath);
      } else {
        await fs.copyFile(sourceFilePath, destinationFilePath);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

copyAssets(
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'project-dist', 'assets'),
);

buildPage();
