export interface AIPrompt {
	type:
		| "create_component"
		| "create_page"
		| "modify_code"
		| "analyze_request";
	content: string;
	context?: {
		projectStructure?: string[];
		currentFile?: string;
		dependencies?: string[];
	};
}

export interface AIResponse {
	type: "code" | "explanation" | "error";
	content: string;
	files?: AIFileUpdate[];
	dependencies?: string[];
}

export interface AIFileUpdate {
	path: string;
	content: string;
	type: "create" | "update" | "delete";
}

export interface CodeGenerationResult {
	success: boolean;
	files: AIFileUpdate[];
	message: string;
	dependencies?: string[];
}
