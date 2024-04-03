# Code Review Assistant

Code Review Assistant is a Visual Studio Code extension that leverages the power of OpenAI's GPT models to review your code. This extension allows you to submit your current file's contents to the OpenAI API, which returns a comprehensive review of your code.

## Features

- **Code Analysis**: Analyze the currently open file in VS Code using GPT-3.5 or GPT-4 models.
- **Flexible Configuration**: Choose between GPT-3.5 and GPT-4 to tailor the review capabilities to your needs.
- **Secure API Key Storage**: Store your OpenAI API key securely within VS Code.

## Getting Started

1. **Installation**
   - Install the extension from the Visual Studio Code Marketplace.
   - Restart VS Code after the installation.

2. **Configuration**
   - Set your OpenAI API key in the extension settings for secure and personalized use.
   - Choose your preferred GPT model (GPT-3.5 or GPT-4) in the extension settings.

### Set Up Your OpenAI API Key

1. Obtain an API key from [OpenAI](https://openai.com/).
2. Go to `File` > `Preferences` > `Settings` (or `Code` > `Preferences` > `Settings` on macOS).
3. Search for `Code Review Assistant` and find the `OpenAI API Key` setting.
4. Enter your API key and save the settings.

### Select the GPT Model

1. In the same settings section, locate the `Model Version` setting under `Code Review Assistant`.
2. Enter either `gpt-3.5-turbo` or `gpt-4` (the extension defaults to GPT 3.5).
3. Save the settings.

## Usage

1. Open the file you want to review in VS Code.
2. Open the Command Palette with `Ctrl+Shift+P` or `Cmd+Shift+P`.
3. Type `Code review current file with GPT` and hit Enter.
4. A markdown preview will open with the code review from the selected GPT model.

## Support

For support, questions, or feature requests, please open an issue on the GitHub repository page for this extension.

## Contributing

Contributions to the Code Review Assistant extension are welcome. Please see the contributing guidelines in the GitHub repository to get started.

## License

This extension is released under the MIT License. See the LICENSE file in the GitHub repository for more details.
