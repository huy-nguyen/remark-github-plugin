export const getHeaderLines = (link: string, language?: string): string[] => {
  if (language === undefined) {
    return [];
  } else {
    switch (language) {
      case 'markup':
        return [`<!--`, `  ${link}`, `-->`];

      case 'css':
      case 'reason':
        return [`/**`, ` * ${link}`, ` */`];

      case 'clike':
      case 'cpp':
      case 'csharp':
      case 'glsl':
      case 'json':
      case 'javascript':
      case 'jsx':
      case 'typescript':
      case 'tsx':
      case 'java':
        return [`/**`, ` * ${link}`, ` */`];

      case 'coffeescript':
      case 'python':
      case 'ruby':
      case 'perl':
        return [`"""`, `${link}`, `"""`];

      case 'elm':
        return [`{-`, `${link}`, `-}`];

      case 'handlebars':
        return [`{{!--`, `${link}`, `--}}`];

      case 'markdown':
        return [`<!---`, `${link}`, `--->`];

      default:
        return [];
    }
  }
};
