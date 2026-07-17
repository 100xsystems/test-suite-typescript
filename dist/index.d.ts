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
export { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
export declare const PROJECT: string;
export declare function projectPath(...segments: string[]): string;
/**
 * Check if a file exists at the given path relative to PROJECT.
 */
export declare function fileExists(...segments: string[]): boolean;
/**
 * Check if a directory exists at the given path relative to PROJECT.
 */
export declare function dirExists(...segments: string[]): boolean;
/**
 * Read a file's content as UTF-8 string.
 * Throws if the file does not exist.
 */
export declare function readFile(...segments: string[]): string;
/**
 * Read and parse a JSON file.
 * Throws with a descriptive error if the file does not exist or is not valid JSON.
 */
export declare function readJson<T = any>(...segments: string[]): T;
/**
 * List files in a directory, optionally filtered by extension.
 * Returns relative file names (not full paths).
 */
export declare function listDir(dir: string, extension?: string): string[];
/**
 * Check if a file at the given relative path contains the specified pattern (string or RegExp).
 * Returns true if the pattern is found, false otherwise.
 */
export declare function fileContains(relativePath: string, pattern: string | RegExp): boolean;
/**
 * Check if a file at the given relative path matches the specified RegExp pattern.
 * Alias for fileContains with RegExp for readability.
 */
export declare function fileMatches(relativePath: string, pattern: RegExp): boolean;
/**
 * Run `npm run build` and return the stdout output.
 * Throws if the build command fails.
 */
export declare function runBuild(): string;
/**
 * Run a shell command in the project directory and return stdout.
 * Throws if the command exits with non-zero.
 */
export declare function runCommand(command: string, timeout?: number): string;
/**
 * Assert that `npm run build` succeeds and produces output in dist/.
 * Throws with a descriptive message if build fails or dist/ is missing.
 * Used as the cumulative build check that appears in every lesson test.
 */
export declare function expectBuildSucceeds(): void;
/**
 * Dynamically import a built module from the dist/ directory.
 * Useful for behavioral tests that run imported code.
 *
 * @param relativePath - Path relative to dist/ (e.g., 'llm/streaming.js')
 */
export declare function importModule(relativePath: string): Promise<any>;
//# sourceMappingURL=index.d.ts.map