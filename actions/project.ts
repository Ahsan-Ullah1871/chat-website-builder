"use server";

import { createClient } from "../lib/supabase/client";
import { Project } from "../lib/project/types";
import { createProject, getProject } from "../lib/project/projectManager";

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

