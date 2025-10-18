# ChatGPT Em Dash Remover

A Chrome extension that automatically removes em dashes (—) from ChatGPT responses when copying text, replacing them with commas for better readability.

## Features

- **Automatic Em Dash Removal**: Replaces all em dashes with commas when copying
- **Clean Copy**: Removes "ChatGPT said:" prefix and other UI elements
- **Visual Feedback**: Shows the same grey checkmark animation ChatGPT uses
- **Seamless Integration**: Works transparently with ChatGPT's existing copy button

## Installation

### From Source
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will now be active on ChatGPT

## How It Works

The extension intercepts clicks on ChatGPT's copy buttons and:
1. Extracts the message text
2. Replaces all em dashes (—) with commas
3. Removes UI text like "ChatGPT said:"
4. Copies the cleaned text to your clipboard
5. Shows a checkmark animation for visual confirmation

## Supported Sites

- chat.openai.com
- chatgpt.com

## Why This Extension?

ChatGPT often uses em dashes in its responses, which can make text harder to read when pasted into other applications. This extension automatically cleans up the text for you, making it more readable and professional.

## License

MIT

## Contributing

Feel free to submit issues or pull requests on GitHub.