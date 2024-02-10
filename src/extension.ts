import * as vscode from "vscode";

import { LanguageClient } from "vscode-languageclient/node";

let lspClient: LanguageClient | null = null;

export async function activate(context: vscode.ExtensionContext) {
  let restart = vscode.commands.registerCommand(
    "speakeasy-vscode-extension.restart",
    async () => {
      await stopServer();
      await startServer();
    }
  );

  let stop = vscode.commands.registerCommand(
    "speakeasy-vscode-extension.stop",
    async () => {
      await stopServer();
    }
  );

  await startServer();

  context.subscriptions.push(restart, stop);
}

async function startServer() {
  const command = "speakeasy";

  lspClient = new LanguageClient(
    "speakeasy-vscode-extension",
    {
      run: { command: command, args: ["language-server"] },
      debug: { command: command, args: ["language-server"] },
    },
    {
      documentSelector: [
        { scheme: "file", language: "yaml" },
        { scheme: "file", language: "json" },
      ],
    }
  );
  await lspClient.start();

  vscode.window.showInformationMessage(
    "The Speakeasy extension is enabled and validating your OpenAPI 3.X Documents."
  );
}

async function stopServer() {
  await lspClient?.stop();
  lspClient = null;
}

export async function deactivate() {
  await stopServer();
}
