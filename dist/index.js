/**
 * @100xsystems/test-suite-typescript
 *
 * Shared test helpers for 100xSystems TypeScript curriculum.
 * Eliminates boilerplate duplication across lesson behavior.test.ts files.
 *
 * Instead of each test file importing vitest + child_process + fs + path
 * and writing the same helpers, they import from this package.
 *
 * @example
 * ```typescript
 * import { describe, it, expect, fileExists, readFile, readJson, runBuild } from '@100xsystems/test-suite-typescript';
 *
 * describe('Lesson 1', () => {
 *   it('has package.json', () => {
 *     expect(fileExists('package.json')).toBe(true);
 *   });
 * });
 * ```
 */
// ─── Re-export vitest essentials ────────────────────────────────────
// Tests always need these. By re-exporting from here, lesson test files
// don't need to import from 'vitest' directly.
export { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
// ─── Project Root ───────────────────────────────────────────────────
// Every test file defines `const PROJECT = process.cwd()`. Centralize it.
// Tests call helpers with relative paths that are resolved against PROJECT.
export const PROJECT = process.cwd();
/**
 * Resolve a path segment relative to the project root.
 * Supports both string segments and arrays of segments.
 *
 * @example
 * projectPath('package.json')                // → /abs/path/package.json
 * projectPath('src', 'cli.ts')               // → /abs/path/src/cli.ts
 * projectPath('src', 'tools', 'registry.ts') // → /abs/path/src/tools/registry.ts
 */
import path from 'path';
export function projectPath(...segments) {
    return path.join(PROJECT, ...segments);
}
// ─── File Helpers ───────────────────────────────────────────────────
import fs from 'fs';
/**
 * Check if a file exists at the given path relative to PROJECT.
 */
export function fileExists(...segments) {
    return fs.existsSync(projectPath(...segments));
}
/**
 * Check if a directory exists at the given path relative to PROJECT.
 */
export function dirExists(...segments) {
    try {
        return fs.statSync(projectPath(...segments)).isDirectory();
    }
    catch {
        return false;
    }
}
/**
 * Read a file's content as UTF-8 string.
 * Throws if the file does not exist.
 */
export function readFile(...segments) {
    return fs.readFileSync(projectPath(...segments), 'utf-8');
}
/**
 * Read and parse a JSON file.
 * Throws with a descriptive error if the file does not exist or is not valid JSON.
 */
export function readJson(...segments) {
    const fp = projectPath(...segments);
    if (!fs.existsSync(fp)) {
        throw new Error(`readJson failed: file not found at ${fp}`);
    }
    try {
        const content = fs.readFileSync(fp, 'utf-8');
        return JSON.parse(content);
    }
    catch (e) {
        if (e instanceof SyntaxError) {
            throw new Error(`readJson failed: invalid JSON in ${fp} — ${e.message}`);
        }
        throw e;
    }
}
/**
 * List files in a directory, optionally filtered by extension.
 * Returns relative file names (not full paths).
 */
export function listDir(dir, extension) {
    const fullPath = projectPath(dir);
    if (!fs.existsSync(fullPath))
        return [];
    const entries = fs.readdirSync(fullPath, { recursive: true });
    if (extension) {
        return entries.filter((f) => f.endsWith(extension));
    }
    return entries;
}
// ─── Content Check Helpers ──────────────────────────────────────────
/**
 * Check if a file at the given relative path contains the specified pattern (string or RegExp).
 * Returns true if the pattern is found, false otherwise.
 */
export function fileContains(relativePath, pattern) {
    if (!fs.existsSync(projectPath(relativePath)))
        return false;
    const content = readFile(relativePath);
    if (typeof pattern === 'string') {
        return content.includes(pattern);
    }
    return pattern.test(content);
}
/**
 * Check if a file at the given relative path matches the specified RegExp pattern.
 * Alias for fileContains with RegExp for readability.
 */
export function fileMatches(relativePath, pattern) {
    return fileContains(relativePath, pattern);
}
// ─── Build Helpers ──────────────────────────────────────────────────
import { execSync } from 'child_process';
/**
 * Run `npm run build` and return the stdout output.
 * Throws if the build command fails.
 */
export function runBuild() {
    return execSync('npm run build', {
        cwd: PROJECT,
        encoding: 'utf-8',
        timeout: 60000,
    });
}
/**
 * Run a shell command in the project directory and return stdout.
 * Throws if the command exits with non-zero.
 */
export function runCommand(command, timeout = 30000) {
    return execSync(command, {
        cwd: PROJECT,
        encoding: 'utf-8',
        timeout,
    });
}
// ─── Build Assertion ───────────────────────────────────────────────
/**
 * Assert that `npm run build` succeeds and produces output in dist/.
 * Throws with a descriptive message if build fails or dist/ is missing.
 * Used as the cumulative build check that appears in every lesson test.
 */
export function expectBuildSucceeds() {
    runBuild();
    const distDir = projectPath('dist');
    if (!fs.existsSync(distDir)) {
        throw new Error('Build succeeded but dist/ directory was not created.');
    }
    const contents = fs.readdirSync(distDir);
    if (contents.length === 0) {
        throw new Error('Build succeeded but dist/ directory is empty.');
    }
}
// ─── Dynamic Import Helper ──────────────────────────────────────────
/**
 * Dynamically import a built module from the dist/ directory.
 * Useful for behavioral tests that run imported code.
 *
 * @param relativePath - Path relative to dist/ (e.g., 'llm/streaming.js')
 */
export async function importModule(relativePath) {
    return import(projectPath('dist', relativePath));
}
//# sourceMappingURL=index.js.map