declare module "html-minifier-terser" {
  export interface HtmlMinifierOptions {
    collapseWhitespace?: boolean;
    conservativeCollapse?: boolean;
    removeComments?: boolean;
    minifyCSS?: boolean | Record<string, unknown>;
    minifyJS?: boolean | Record<string, unknown>;
    [key: string]: unknown;
  }

  export function minify(
    input: string,
    options?: HtmlMinifierOptions,
  ): Promise<string> | string;
}
