import * as path from "path";
import * as vscode from "vscode";
import BOJ from "./BOJ";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "bojhelper" is now active!');
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "bojhelper.test",
    async () => {
      // The code you place here will be executed every time your command is executed
      const terminal = vscode.window.createOutputChannel("BOJ");
      try {
        const currentlyOpenTabfilePath = vscode.window.activeTextEditor
          ?.document.fileName as string;
        await vscode.window.activeTextEditor?.document.save();
        const boj = new BOJ(context.extensionPath, currentlyOpenTabfilePath);
        const testNumber = await boj.prepareTest();
        terminal.show(true);
        terminal.appendLine(`---------${testNumber}번 채점 시작---------`);
        terminal.appendLine(
          `문제링크: https://www.acmicpc.net/problem/${testNumber}`
        );
        terminal.appendLine(`결과 창은 1분 뒤에 닫힙니다.`);

        boj.test(terminal);
        // Display a message box to the user
        vscode.window.showInformationMessage(`${currentlyOpenTabfilePath}`);
      } catch (e) {
        vscode.window.showInformationMessage(
          `test error!: ${e} ${context.extensionPath}`
        );
      }
      setTimeout(() => {
        terminal.dispose();
      }, 60000);
      // Display a message box to the user
      // vscode.window.showInformationMessage(`test error!`);
    }
  );
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
