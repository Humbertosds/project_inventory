import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs/promises';
import sharp from "sharp";

// Obtém o caminho do arquivo atual e o diretório
// Necessário em módulos ES6 onde __dirname não está disponível nativamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constantes de configuração
const AVATAR_SIZE = 50; // Tamanho em pixels (50x50)
const AVATAR_DIR = path.join(__dirname, '../../public/avatars'); // Diretório de armazenamento

/**
 * Salva e processa um avatar de usuário
 *
 * Funcionalidades:
 * - Cria o diretório de avatares caso não exista
 * - Redimensiona a imagem para 50x50 pixels
 * - Aplica crop centralizado para manter proporção
 * - Salva com nome único baseado em timestamp
 *
 * @param fileBuffer - Buffer da imagem enviada pelo usuário
 * @param originalName - Nome original do arquivo (usado para extrair extensão)
 * @returns Nome do arquivo salvo (ex: "avatar-1234567890.jpg")
 *
 * @example
 * const filename = await saveAvatar(imageBuffer, "foto.jpg");
 * // Retorna: "avatar-1705847123456.jpg"
 */
export const saveAvatar = async (fileBuffer: Buffer, originalName: string) => {
    // Garante que o diretório existe (cria recursivamente se necessário)
    await fs.mkdir(AVATAR_DIR, { recursive: true });

    // Extrai a extensão do arquivo original (ex: ".jpg", ".png")
    const ext = path.extname(originalName);

    // Gera nome único usando timestamp para evitar conflitos
    const filename = `avatar-${Date.now()}${ext}`;

    // Monta o caminho completo do arquivo
    const filepath = path.join(AVATAR_DIR, filename);

    // Processa e salva a imagem usando sharp
    await sharp(fileBuffer)
        .resize(AVATAR_SIZE, AVATAR_SIZE, {
            fit: 'cover',      // Preenche toda a área, aplicando crop se necessário
            position: 'center' // Centraliza a imagem ao fazer o crop
        })
        .toFile(filepath);

    return filename;
}

/**
 * Remove um arquivo de avatar do sistema de arquivos
 *
 * Segurança:
 * - Valida se o filename existe antes de tentar deletar
 * - Constrói o caminho completo para evitar path traversal
 *
 * @param filename - Nome do arquivo a ser deletado (ex: "avatar-1234567890.jpg")
 *
 * @example
 * await deleteAvatar("avatar-1705847123456.jpg");
 *
 * @throws Pode lançar erro se o arquivo não existir ou não houver permissões
 */
export const deleteAvatar = async (filename: string) => {
    // Proteção: não tenta deletar se filename for vazio/null/undefined
    if (!filename) return;

    // Monta o caminho completo do arquivo
    const filepath = path.join(AVATAR_DIR, filename);

    // Remove o arquivo do disco
    await fs.unlink(filepath);
}
