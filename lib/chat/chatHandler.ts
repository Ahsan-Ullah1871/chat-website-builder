import { Message } from "./types";
import {
	createProject,
	getProject,
	updateProjectFile,
} from "../project/projectManager";
import { generateCode } from "../ai/aiService";
import { AIPrompt } from "../ai/types";
import { Project } from "../project/types";

export async function handleChatMessage(
	message: string,
	currentProject?: string
): Promise<Message[]> {
	const userMessage: Message = {
		id: Date.now().toString(),
		content: message,
		role: "user",
	};

	const assistantMessage: Message = {
		id: (Date.now() + 1).toString(),
		content: "",
		role: "assistant",
		status: "loading",
	};

	try {
		// Project creation request
		if (
			message.toLowerCase().includes("create") &&
			message.toLowerCase().includes("project")
		) {
			const projectName =
				message.split(" ").pop() || "new-project";
			const project = await createProject({
				name: projectName,
				template: "next-tailwind",
			});

			assistantMessage.content = `I've created a new project "${project.name}" with Next.js and Tailwind CSS. You can now start adding components and pages.`;
			assistantMessage.status = "success";
			assistantMessage.action = {
				type: "create_project",
				payload: { projectId: project.id },
			};
			return [userMessage, assistantMessage];
		}

		// If no current project, prompt to create one
		if (!currentProject) {
			assistantMessage.content =
				"Please create a project first by saying 'create project [name]'";
			assistantMessage.status = "error";
			return [userMessage, assistantMessage];
		}

		// Get current project context
		const project = await getProject(currentProject);

		// Analyze the request with AI
		const aiPrompt: AIPrompt = {
			type: "analyze_request",
			content: message,
			context: {
				projectStructure: project.files.map((f) => f.path),
				dependencies: [], // TODO: Get from package.json
			},
		};

		const result = await generateCode(aiPrompt);

		if (!result.success) {
			assistantMessage.content = result.message;
			assistantMessage.status = "error";
			return [userMessage, assistantMessage];
		}

		// Apply the changes
		for (const file of result.files) {
			if (file.type === "create" || file.type === "update") {
				await updateProjectFile(
					project.id,
					file.path,
					file.content
				);
			}
		}

		assistantMessage.content = result.message;
		assistantMessage.status = "success";
		assistantMessage.action = {
			type: "update_file",
			payload: {
				files: result.files.map((f) => f.path),
			},
		};
	} catch (error) {
		console.error("Chat handler error:", error);
		assistantMessage.content =
			"Sorry, something went wrong. Please try again.";
		assistantMessage.status = "error";
	}

	return [userMessage, assistantMessage];
}

