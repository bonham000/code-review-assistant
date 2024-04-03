import * as vscode from "vscode";
import OpenAI from "openai";

async function getApiKey(): Promise<string | undefined> {
  const config = vscode.workspace.getConfiguration("code-review-assistant");
  return config.get<string>("OPEN_AI_API_KEY");
}

function getModelVersion(): string {
  const config = vscode.workspace.getConfiguration("code-review-assistant");
  return config.get<string>("MODEL_VERSION", "gpt-3.5-turbo");
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
  const apiKey = await getApiKey();
  if (!apiKey) {
    vscode.window.showWarningMessage(
      "Cannot initialize without an OpenAI API key. Please check the README to include your API key."
    );
    return;
  }

  const openai = new OpenAI({
    apiKey,
  });

  const content = `
	You are a Senior Software Engineer reviewing some code. This is one file for you to review. Please write a review in text and markdown, using code snippets where needed. The review should be concise, and easy to read quickly. Here is the code:

	${fileContents}
	`;
  const model = getModelVersion();
  vscode.window.showInformationMessage(
    `🧑‍💻 Generating a code review with ${model} - please wait a moment.`
  );
  let review = null;
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ content, role: "user" }],
      model,
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
            edit.insert(new vscode.Position(0, 0), review!);
          })
          .then(() => {
            vscode.commands.executeCommand("markdown.showPreview", uri);
          });
      });
  });
}

export function deactivate() {}
