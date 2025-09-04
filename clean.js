const fs = require('fs');
const path = require('path');

const distPath = path.resolve(__dirname, 'dist');

if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
  console.log('Pasta dist removida com sucesso.');
} else {
  console.log('Pasta dist não encontrada. Nada a remover.');
}