import * as vscode from "vscode";
import generateUnitTest from "./create-unit-test";

export async function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "generateUnitTest.generate",
    async (uri: vscode.Uri) => {
      const apiKey = await vscode.window.showInputBox({
        prompt: "Please enter your OpenAI API key",
        ignoreFocusOut: true,
      });

      if (apiKey) {
        const componentPath = uri.fsPath;
        await generateUnitTest(componentPath, apiKey);
      } else {
        vscode.window.showErrorMessage("OpenAI API key not provided");
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
