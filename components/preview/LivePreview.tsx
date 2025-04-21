import { ProjectFile } from "@/lib/project/types";
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";

function LivePreview({ projectFiles }: { projectFiles: ProjectFile[] }) {
	// Convert your project files format to Sandpack format
	const sandpackFiles = {};
	projectFiles?.forEach((file) => {
		(sandpackFiles as Record<string, { code: string }>)[file.path] = {
			code: file.content,
		};
	});

	console.log({ sandpackFiles });

	return (
		<div className="preview-container h-full">
			<SandpackProvider
				template="nextjs"
				files={sandpackFiles}
				// customSetup={{

				// }}
			>
				<SandpackPreview />
			</SandpackProvider>
		</div>
	);
}

export default LivePreview;

