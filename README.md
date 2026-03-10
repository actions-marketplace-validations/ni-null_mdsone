# mdsone — Markdown to Self-Contained HTML

mdsone is a Markdown conversion tool that transforms Markdown documents into fully functional, self-contained HTML files.

## Features

- 📝 **Markdown Support**: Full support for CommonMark standard syntax
- 🎨 **Built-in Templates**: Multiple responsive HTML templates included
- 🌍 **Internationalization**: Multi-language document support (i18n)
- 📦 **Self-Contained**: Generated HTML includes all necessary CSS and assets
- 🖼️ **Image Management**: Embed local and remote images as base64 (with optional resize/compress)
- ⚙️ **Flexible Configuration**: Supports TOML config files and CLI options
- 🔌 **Library & CLI**: Use as a command-line tool or integrate as a JavaScript library

## Quick Start
```bash
npm install -g mdsone
```

Single Markdown file:
```bash
mdsone --source README.md --output index.html
```

Full directory:
```bash
mdsone --source ./docs --output index.html
```

With image embedding:
```bash
mdsone --source README.md --output index.html --img-to-base64 true --img-max-width 400
```

## License

MIT