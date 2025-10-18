# ChatGPT Em Dash Remover

A Chrome extension that automatically removes em dashes (—) from ChatGPT, replacing them with commas both in the conversation view and when copying text.

## Features

- **Live UI Updates**: Replaces em dashes with commas directly in the ChatGPT conversation view
- **Clean Copying**: Automatically cleans text when using the copy button
- **Removes UI Clutter**: Strips "ChatGPT said:" prefix and other UI elements when copying
- **Visual Feedback**: Shows the same grey checkmark animation ChatGPT uses
- **Real-time Processing**: Works on new messages as they appear
- **Seamless Integration**: Works transparently with ChatGPT's existing interface

## Installation

### From Source
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will now be active on ChatGPT

## How It Works

The extension works in two ways:

**In the UI:**
1. Monitors ChatGPT for new messages using MutationObserver
2. Automatically replaces em dashes with commas in the conversation view
3. Processes both existing and new messages in real-time

**When copying:**
1. Intercepts clicks on ChatGPT's copy buttons
2. Extracts and cleans the message text
3. Removes UI text like "ChatGPT said:"
4. Copies the cleaned text to your clipboard
5. Shows a checkmark animation for visual confirmation

## Supported Sites

- chat.openai.com
- chatgpt.com

## Why This Extension?

ChatGPT often uses em dashes in its responses, which can make text harder to read both in the interface and when pasted into other applications. This extension automatically cleans up the text in both places, making everything more readable and professional.

## License

MIT

## Contributing

Feel free to submit issues or pull requests on GitHub.