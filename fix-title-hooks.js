const fs = require('fs');
const path = require('path');

// 页面文件列表
const pageFiles = [
  'src/pages/animations/index.tsx',
  'src/pages/model/index.tsx',
  'src/pages/start-loading/index.tsx',
  'src/pages/components/index.tsx',
  'src/pages/404/index.tsx',
  'src/pages/components/icons/index.tsx',
  'src/pages/request/index.tsx',
  'src/pages/components/modal/index.tsx',
  'src/pages/components/nav/index.tsx'
];

// 修复每个文件
pageFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  // 读取文件内容
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // 替换导入语句
  content = content.replace(
    /import\s+\{\s*useTitle\s*\}\s+from\s+['|"]@\/hooks\/useTitle['|"]/g,
    "import { useTitleSafe } from '@/hooks/useTitleSafe'"
  );
  
  // 替换条件调用
  content = content.replace(
    /if\s*\(\s*props\.title\s*\)\s*useTitle\s*\(\s*props\.title\s*\)/g,
    "useTitleSafe(props.title)"
  );
  
  // 写回文件
  fs.writeFileSync(fullPath, content, 'utf8');
  
  console.log(`Fixed: ${filePath}`);
});

console.log('All files fixed!');