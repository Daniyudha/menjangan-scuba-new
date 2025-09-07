import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.json');

// Fungsi untuk membaca seluruh database dari file JSON
export const readDb = async () => {
  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Could not read database file:', error);
    // Kembalikan struktur kosong jika file tidak ada atau rusak
    return { packages: [], articles: [], testimonials: [], settings: {} };
  }
};

// Fungsi untuk menulis seluruh database ke file JSON
export const writeDb = async (data: any) => {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Could not write to database file:', error);
  }
};