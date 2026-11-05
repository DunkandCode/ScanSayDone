#!/usr/bin/env node
/**
 * check-tokens.mjs — Verifica que los tokens de marca se emiten correctamente en el CSS compilado.
 * 
 * Checks:
 * 1. No debe haber literales `bv.$` sin interpolar (patrón `: bv.$` o `:bv.$`)
 * 2. --brand-plum, --brand-coral, --brand-cream deben tener valores hex (#...) o rgb(...)
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const CSS_DIR = join(process.cwd(), '.next', 'static', 'css');

async function findCssFiles() {
  try {
    const files = await readdir(CSS_DIR);
    return files.filter(f => f.endsWith('.css')).map(f => join(CSS_DIR, f));
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('SKIP: sin build (no existe .next/static/css/)');
      process.exit(0);
    }
    throw err;
  }
}

async function checkTokens() {
  const cssFiles = await findCssFiles();
  
  if (cssFiles.length === 0) {
    console.log('SKIP: sin build (no hay archivos CSS en .next/static/css/)');
    process.exit(0);
  }

  const cssContents = await Promise.all(cssFiles.map(f => readFile(f, 'utf-8')));
  const allCss = cssContents.join('\n');

  // Check 1: No literales bv.$ sin interpolar
  const badPattern = /:\s*bv\.\$/;
  if (badPattern.test(allCss)) {
    console.error('ERROR: Encontrados literales `bv.$` sin interpolar en el CSS compilado.');
    console.error('       Las custom properties deben usar interpolación Sass: #{bv.$var}');
    process.exit(1);
  }

  // Check 2: Tokens de marca deben tener valores válidos (hex o rgb)
  const brandTokens = ['--brand-plum', '--brand-coral', '--brand-cream'];
  const validValuePattern = /#[0-9a-fA-F]{3,8}|rgb\(/;
  
  for (const token of brandTokens) {
    const regex = new RegExp(`${token}:\\s*([^;]+);`, 'm');
    const match = allCss.match(regex);
    
    if (!match) {
      console.error(`ERROR: Token ${token} no encontrado en el CSS compilado.`);
      process.exit(1);
    }
    
    const value = match[1].trim();
    if (!validValuePattern.test(value)) {
      console.error(`ERROR: Token ${token} tiene valor inválido: "${value}"`);
      console.error('       Se esperaba un valor hex (#...) o rgb(...)');
      process.exit(1);
    }
  }

  console.log('OK: tokens emitidos correctamente');
}

checkTokens().catch(err => {
  console.error('ERROR inesperado:', err);
  process.exit(1);
});
