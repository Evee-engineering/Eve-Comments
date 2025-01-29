import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "Eve Comments" is now active!');

	// Enregistrer une commande pour ajouter un commentaire
	let disposable = vscode.commands.registerCommand('eve-comments.addComment', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const languageId = document.languageId; // Récupérer le langage du fichier actif
			const commentSyntax = getCommentSyntax(languageId); // Obtenir la syntaxe de commentaire

			if (commentSyntax) {
				const selection = editor.selection;
				const text = document.getText(selection);

				// Ajouter le commentaire autour du texte sélectionné
				const commentedText = `${commentSyntax.start} ${text} ${commentSyntax.end || ''}`;

				// Remplacer le texte sélectionné par le texte commenté
				editor.edit(editBuilder => {
					editBuilder.replace(selection, commentedText);
				});
			} else {
				vscode.window.showErrorMessage(`Language "${languageId}" is not supported.`);
			}
		}
	});

	context.subscriptions.push(disposable);
}

// Fonction pour obtenir la syntaxe de commentaire en fonction du langage
function getCommentSyntax(languageId: string): { start: string; end?: string } | undefined {
	const commentSyntaxMap: { [key: string]: { start: string; end?: string } } = {
		javascript: { start: '//', end: '' },
		typescript: { start: '//', end: '' },
		python: { start: '#', end: '' },
		html: { start: '<!--', end: '-->' },
		css: { start: '/*', end: '*/' },
		java: { start: '//', end: '' },
		c: { start: '//', end: '' },
		cpp: { start: '//', end: '' },
		php: { start: '//', end: '' },
		ruby: { start: '#', end: '' },
		bash: { start: '#', end: '' },
		sql: { start: '--', end: '' },
	};

	return commentSyntaxMap[languageId];
}

export function deactivate() { }