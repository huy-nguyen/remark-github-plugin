declare module 'github-url-parse' {
  interface Result {
    user: string;
    repo: string;
    branch: string;
    path: string;
    type: string;
  }
  interface ParseFunction {
    (url: string): Result | null;
  }
  const output: ParseFunction;
  export default output;
}
