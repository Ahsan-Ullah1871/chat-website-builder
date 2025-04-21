export interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	status?: "loading" | "error" | "success";
	action?: {
		type: "create_project" | "update_file" | "create_component";
		payload: any;
	};
}

export interface ChatState {
	messages: Message[];
	isProcessing: boolean;
	currentProject?: string;
}
