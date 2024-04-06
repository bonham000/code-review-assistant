import * as vscode from "vscode";
import OpenAI from "openai";

type Config = {
  api_key: string | undefined;
  model_version: string;
  open_markdown_preview: boolean;
};

function getConfig(): Config {
  const config = vscode.workspace.getConfiguration("code-review-assistant");
  return {
    api_key: config.get<string>("OPEN_AI_API_KEY"),
    model_version: config.get<string>("MODEL_VERSION", "gpt-3.5-turbo"),
    open_markdown_preview: config.get<boolean>("OPEN_MARKDOWN_PREVIEW", false),
  };
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "code-review-assistant.analyzeFile",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const fileContents = document.getText();
        analyzeFileContents(fileContents);
      }
    }
  );

  context.subscriptions.push(disposable);
}

async function analyzeFileContents(fileContents: string) {
  const { api_key, model_version, open_markdown_preview } = await getConfig();
  if (!api_key) {
    vscode.window.showWarningMessage(
      "Cannot initialize without an OpenAI API key."
    );
    return;
  }

  const openai = new OpenAI({
    apiKey: api_key,
  });

  const content = `
	You are a Senior Software Engineer reviewing some code. This is one file for you to review. Please write a review in text and markdown, using code snippets where needed. The review should be concise, and easy to read quickly. The most important thing is to identify any bugs, problems or improvements which could be made. Here is the code:

	${fileContents}
	`;

  vscode.window.showInformationMessage(
    `🧑‍💻 Generating a code review with ${model_version}...`
  );
  let review = null;
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ content, role: "user" }],
      model: model_version,
    });
    review = completion.choices[0].message.content;
  } catch (err) {
    console.error(err);
    vscode.window.showErrorMessage(
      "The API request failed with an unknown error."
    );
    return;
  }

  if (review === null) {
    vscode.window.showErrorMessage("Failed to find a review in the response.");
    return;
  }

  vscode.window.showInformationMessage(
    "✅ Review generated! Opening Markdown file."
  );
  const uri = vscode.Uri.parse("untitled:code-review.md");
  await vscode.workspace.openTextDocument(uri).then((doc) => {
    vscode.languages.setTextDocumentLanguage(doc, "markdown");
    return vscode.window
      .showTextDocument(doc, { preview: false })
      .then((editor) => {
        editor
          .edit((edit) => {
            edit.insert(new vscode.Position(0, 0), review);
          })
          .then(() => {
            if (open_markdown_preview) {
              vscode.commands.executeCommand("markdown.showPreview", uri);
            }
          });
      });
  });
}

export function deactivate() {}
