"use client";

import { useState } from "react";
import { ProjectFile } from "@/lib/project/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodePreviewProps {
	file: ProjectFile;
}

export function CodePreview({ file }: CodePreviewProps) {
	const [showLineNumbers, setShowLineNumbers] = useState(true);

	const getLanguage = (path: string) => {
		const extension = path.split(".").pop()?.toLowerCase();
		switch (extension) {
			case "tsx":
			case "ts":
				return "typescript";
			case "jsx":
			case "js":
				return "javascript";
			case "css":
				return "css";
			case "json":
				return "json";
			default:
				return "plaintext";
		}
	};

	return (
		<div className="h-full flex flex-col bg-[#1E1E1E]">
			<div className="flex items-center justify-between p-2 border-b border-gray-800">
				<div className="text-sm text-gray-400">
					{file.path}
				</div>
				<button
					onClick={() =>
						setShowLineNumbers(!showLineNumbers)
					}
					className="text-sm text-gray-400 hover:text-white px-2 py-1 rounded"
				>
					{showLineNumbers
						? "Hide Line Numbers"
						: "Show Line Numbers"}
				</button>
			</div>
			<div className="flex-1 overflow-auto">
				<SyntaxHighlighter
					language={getLanguage(file.path)}
					style={vscDarkPlus}
					showLineNumbers={showLineNumbers}
					customStyle={{
						margin: 0,
						padding: "1rem",
						height: "100%",
						background: "#1E1E1E",
					}}
				>
					{file.content}
				</SyntaxHighlighter>
			</div>
		</div>
	);
}
