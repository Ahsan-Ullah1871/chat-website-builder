"use server";

import { createClient } from "../lib/supabase/server";
import { Project, ProjectFile, DEFAULT_FILES } from "../lib/project/types";
import { createProject, getProject } from "../lib/project/projectManager";

// Helper function to determine file type based on extension
function getFileType(path: string): string {
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
		case "html":
			return "html";
		case "json":
			return "json";
		case "md":
			return "markdown";
		default:
			return "text";
	}
}

export async function initializeProject(): Promise<{
	project: Project | null;
	error: string | null;
}> {
	try {
		const supabase = await createClient();

		// First try to get existing projects
		const { data: projects, error } = await supabase
			.from("projects")
			.select("*")
			.order("created_at", { ascending: false })
			.limit(1);

		if (error) {
			throw error;
		}

		let project;
		if (projects && projects.length > 0) {
			// Use the most recent project
			project = projects[0];
			console.log("Using existing project:", project);
		} else {
			// Create new project if none exist
			project = await createProject("My New Project");
			console.log("Created new project:", project);

			// Create default files with proper types
			const filesWithTypes = DEFAULT_FILES.map((file) => ({
				...file,
				type: getFileType(file.path),
			}));

			// Insert files into project_files table
			const { error: filesError } = await supabase
				.from("project_files")
				.insert(
					filesWithTypes.map((file) => ({
						project_id: project.id,
						path: file.path,
						content: file.content,
						type: file.type,
					}))
				);

			if (filesError) {
				throw filesError;
			}
		}

		// Load the project with its files
		const projectWithFiles = await getProject(project.id);

		return {
			project: projectWithFiles,
			error: null,
		};
	} catch (error) {
		console.error("Failed to initialize project:", error);
		return {
			project: null,
			error:
				error instanceof Error
					? error.message
					: "Failed to initialize project",
		};
	}
}
