"use server";

import OpenAI from "openai";
import { AIPrompt, AIResponse, CodeGenerationResult } from "./types";

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	dangerouslyAllowBrowser: true, // Only for development
});

export async function generateCode(
	prompt: AIPrompt
): Promise<CodeGenerationResult> {
	try {
		// Create a structured prompt for the AI
		const structuredPrompt = createStructuredPrompt(prompt);

		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are a Next.js and React expert. Generate code based on the user's requirements. Return code in a structured format that can be parsed.",
				},
				{
					role: "user",
					content: structuredPrompt,
				},
			],
			temperature: 0.7,
			max_tokens: 2000,
		});

		// Parse the AI response
		const response = parseAIResponse(
			completion.choices[0].message.content
		);

		return {
			success: true,
			files: response.files || [],
			message: response.content,
			dependencies: response.dependencies,
		};
	} catch (error) {
		console.error("AI Code Generation Error:", error);
		return {
			success: false,
			files: [],
			message: "Failed to generate code. Please try again.",
		};
	}
}

function createStructuredPrompt(prompt: AIPrompt): string {
	let structuredPrompt = `Task: ${prompt.type}\nRequirements: ${prompt.content}\n`;

	if (prompt.context) {
		if (prompt.context.projectStructure) {
			structuredPrompt +=
				"\nProject Structure:\n" +
				prompt.context.projectStructure.join("\n");
		}
		if (prompt.context.currentFile) {
			structuredPrompt +=
				"\nCurrent File: " + prompt.context.currentFile;
		}
		if (prompt.context.dependencies) {
			structuredPrompt +=
				"\nDependencies:\n" +
				prompt.context.dependencies.join("\n");
		}
	}

	structuredPrompt +=
		"\n\nPlease provide the code in the following format:\n";
	structuredPrompt += "---FILES---\n";
	structuredPrompt += "[file path]\n[file content]\n";
	structuredPrompt += "---DEPENDENCIES---\n";
	structuredPrompt += "[dependency list]\n";
	structuredPrompt += "---EXPLANATION---\n";
	structuredPrompt += "[explanation of changes]\n";

	return structuredPrompt;
}

function parseAIResponse(response: string): AIResponse {
	try {
		const files: AIResponse["files"] = [];
		const dependencies: string[] = [];
		let content = "";

		// Split response into sections
		const sections = response.split("---");

		sections.forEach((section) => {
			if (section.includes("FILES")) {
				// Parse files
				const fileBlocks = section
					.split("[file path]")
					.filter(Boolean);
				fileBlocks.forEach((block) => {
					const [path, content] =
						block.split("[file content]");
					if (path && content) {
						files.push({
							path: path.trim(),
							content: content.trim(),
							type: "create",
						});
					}
				});
			} else if (section.includes("DEPENDENCIES")) {
				// Parse dependencies
				const deps = section
					.split("\n")
					.filter(
						(line) =>
							line.trim() &&
							!line.includes("DEPENDENCIES")
					);
				dependencies.push(...deps);
			} else if (section.includes("EXPLANATION")) {
				// Get explanation
				content = section.replace("EXPLANATION", "").trim();
			}
		});

		return {
			type: "code",
			content,
			files,
			dependencies,
		};
	} catch (error) {
		console.error("Failed to parse AI response:", error);
		return {
			type: "error",
			content: "Failed to parse AI response",
		};
	}
}

