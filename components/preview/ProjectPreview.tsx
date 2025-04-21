"use client";

import { useEffect, useState } from "react";
import { Project, ProjectFile } from "@/lib/project/types";

interface ProjectPreviewProps {
	project: Project;
}

export default function ProjectPreview({ project }: ProjectPreviewProps) {
	const [content, setContent] = useState<string>("");

	useEffect(() => {
		// Find the main page file
		const mainPage = project.files.find(
			(file) => file.path === "app/page.tsx"
		);
		const globals = project.files.find(
			(file) => file.path === "app/globals.css"
		);

		if (mainPage && globals) {
			// Create a style element for the global CSS
			const styleElement = document.createElement("style");
			styleElement.textContent = globals.content;
			document.head.appendChild(styleElement);

			// For now, we'll just show the raw content
			// In the future, we'll need to compile and render the actual component
			setContent(mainPage.content);

			// Cleanup
			return () => {
				document.head.removeChild(styleElement);
			};
		}
	}, [project]);

	return (
		<div className="w-full h-full">
			{content ? (
				<div className="p-4">
					<pre className="text-sm text-gray-600">
						{content}
					</pre>
					<div className="mt-4 text-sm text-gray-500">
						Note: This is a preview of the file
						content. Full component rendering will
						be implemented soon.
					</div>
				</div>
			) : (
				<div className="h-full flex items-center justify-center text-gray-400">
					Loading preview...
				</div>
			)}
		</div>
	);
}

