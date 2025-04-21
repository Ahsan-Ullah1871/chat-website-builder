"use server";

import { createClient } from "../supabase/client";
import { Project, ProjectFile, DEFAULT_FILES } from "./types";

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

export async function createProject(
	name: string,
	description?: string
): Promise<Project> {
	const supabase = await createClient();

	try {
		// Create project
		const { data: project, error: projectError } = await supabase
			.from("projects")
			.insert({
				name,
				description,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (projectError) {
			console.error("Project creation error:", projectError);
			throw new Error(
				`Failed to create project: ${projectError.message}`
			);
		}

		if (!project) {
			throw new Error(
				"Project creation failed: No data returned"
			);
		}

		// Create default files for the project with proper types
		const filesToInsert = DEFAULT_FILES.map((file) => ({
			...file,
			project_id: project.id,
			type: getFileType(file.path),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		}));

		const { error: filesError } = await supabase
			.from("project_files")
			.insert(filesToInsert);

		if (filesError) {
			// If files creation fails, delete the project to maintain consistency
			await supabase
				.from("projects")
				.delete()
				.eq("id", project.id);
			throw new Error(
				`Failed to create default files: ${filesError.message}`
			);
		}

		return project;
	} catch (error) {
		console.error("Project creation error:", error);
		throw error;
	}
}

export async function getProject(
	id: string
): Promise<Project & { files: ProjectFile[] }> {
	const supabase = await createClient();

	try {
		// Get project with its files in a single query
		const { data: project, error: projectError } = await supabase
			.from("projects")
			.select(
				`
				*,
				files:project_files(*)
			`
			)
			.eq("id", id)
			.single();

		if (projectError) {
			console.error("Project fetch error:", projectError);
			throw new Error(
				`Failed to fetch project: ${projectError.message}`
			);
		}

		if (!project) {
			throw new Error("Project not found");
		}

		return {
			...project,
			files: project.files || [],
		};
	} catch (error) {
		console.error("Project fetch error:", error);
		throw error;
	}
}

export async function updateProjectFile(
	projectId: string,
	filePath: string,
	content: string
): Promise<void> {
	const supabase = await createClient();

	try {
		const { error } = await supabase
			.from("project_files")
			.update({
				content,
				updated_at: new Date().toISOString(),
			})
			.eq("project_id", projectId)
			.eq("path", filePath);

		if (error) {
			console.error("File update error:", error);
			throw new Error(`Failed to update file: ${error.message}`);
		}
	} catch (error) {
		console.error("File update error:", error);
		throw error;
	}
}

export async function createProjectFile(
	projectId: string,
	file: Omit<
		ProjectFile,
		"project_id" | "id" | "created_at" | "updated_at"
	>
): Promise<ProjectFile> {
	const supabase = await createClient();

	try {
		const { data, error } = await supabase
			.from("project_files")
			.insert({
				...file,
				project_id: projectId,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.select()
			.single();

		if (error) {
			console.error("File creation error:", error);
			throw new Error(`Failed to create file: ${error.message}`);
		}

		if (!data) {
			throw new Error("File creation failed: No data returned");
		}

		return data;
	} catch (error) {
		console.error("File creation error:", error);
		throw error;
	}
}

export async function deleteProjectFile(
	projectId: string,
	filePath: string
): Promise<void> {
	const supabase = await createClient();

	try {
		const { error } = await supabase
			.from("project_files")
			.delete()
			.eq("project_id", projectId)
			.eq("path", filePath);

		if (error) {
			console.error("File deletion error:", error);
			throw new Error(`Failed to delete file: ${error.message}`);
		}
	} catch (error) {
		console.error("File deletion error:", error);
		throw error;
	}
}

