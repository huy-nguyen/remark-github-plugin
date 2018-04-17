export const wrapInComment = (phrase: string, language?: string): string | undefined => {
  if (language === undefined) {
    return undefined;
  } else {
    switch (language) {
      case 'markup':
        return `<!-- ${phrase} -->`;

      case 'css':
        return `/* ${phrase} */`;

      case 'clike':
      case 'cpp':
      case 'csharp':
      case 'glsl':
      case 'json':
      case 'javascript':
      case 'typescript':
      case 'java':
        return `// ${phrase}`;

      case 'coffeescript':
      case 'python':
      case 'ruby':
      case 'perl':
        return `# ${phrase}`;

      case 'elm':
        return `-- ${phrase}`;

      case 'handlebars':
        return `{{!-- ${phrase} --}}`;

      case 'markdown':
        return `<!--- ${phrase} --->`;

      default:
        return undefined;
    }
  }
};
