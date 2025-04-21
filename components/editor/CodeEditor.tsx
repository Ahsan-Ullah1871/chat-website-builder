"use client";

import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
	code: string;
	language?: string;
	onChange?: (value: string | undefined) => void;
}

export default function CodeEditor({
	code,
	language = "typescript",
	onChange,
}: CodeEditorProps) {
	return (
		<Editor
			height="100%"
			defaultLanguage={language}
			defaultValue={code}
			theme="vs-dark"
			options={{
				minimap: { enabled: false },
				fontSize: 14,
				lineNumbers: "on",
				scrollBeyondLastLine: false,
				wordWrap: "on",
				automaticLayout: true,
				tabSize: 2,
				showUnused: false,
				folding: true,
				dragAndDrop: true,
				formatOnPaste: true,
				formatOnType: true,
			}}
			onChange={onChange}
		/>
	);
}
