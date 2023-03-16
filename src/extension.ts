import * as vscode from "vscode";
import generateUnitTest from "./create-unit-test";

const API_KEY_SETTING = "generateUnitTest.apiKey";

export async function activate(context: vscode.ExtensionContext) {
  let apiKey = vscode.workspace.getConfiguration().get(API_KEY_SETTING);
  if (!apiKey) {
    apiKey = await vscode.window.showInputBox({
      prompt: "Please enter your OpenAI API key",
      ignoreFocusOut: true,
    });
    if (apiKey) {
      await vscode.workspace
        .getConfiguration()
        .update(API_KEY_SETTING, apiKey, vscode.ConfigurationTarget.Global);
    } else {
      vscode.window.showErrorMessage("OpenAI API key not provided");
      return;
    }
  }

  const disposable = vscode.commands.registerCommand(
    "generateUnitTest.generate",
    async (uri: vscode.Uri) => {
      const componentPath = uri.fsPath;
      await generateUnitTest(componentPath, apiKey as string);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
