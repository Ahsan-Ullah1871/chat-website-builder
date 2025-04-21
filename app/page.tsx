"use client";

import { useState, useEffect } from "react";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";
import { CodePreview } from "../components/preview/CodePreview";
import LivePreview from "../components/preview/LivePreview";
import { Message } from "../lib/chat/types";
import { handleChatMessage } from "../lib/chat/chatHandler";
import { Project, ProjectFile } from "../lib/project/types";
import { getProject } from "../lib/project/projectManager";
import { initializeProject } from "../actions/project";

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [activeTab, setActiveTab] = useState<"preview" | "code">(
		"preview"
	);
	const [currentProject, setCurrentProject] = useState<Project | null>(
		null
	);
	const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(
		null
	);
	const [isProcessing, setIsProcessing] = useState(false);

	// Initialize project on mount
	useEffect(() => {
		const initProject = async () => {
			try {
				const { project, error } =
					await initializeProject();

				if (error) {
					throw new Error(error);
				}

				if (project) {
					setCurrentProject(project);
					if (
						project.files &&
						project.files.length > 0
					) {
						setSelectedFile(project.files[0]);
					}

					// Add welcome message
					setMessages([
						{
							id: Date.now().toString(),
							content: `I've loaded a Next.js project with Tailwind CSS. The project includes:
- A modern landing page
- Basic UI components (Button, Card)
- Responsive layout
- Tailwind configuration

You can now start customizing the project. Try saying:
- "Create a new page called about"
- "Add a navigation menu"
- "Create a contact form component"`,
							role: "assistant",
							status: "success",
						},
					]);
				}
			} catch (error) {
				console.error(
					"Failed to initialize project:",
					error
				);
				setMessages([
					{
						id: Date.now().toString(),
						content: "Sorry, something went wrong while initializing the project. Please try refreshing the page.",
						role: "assistant",
						status: "error",
					},
				]);
			}
		};

		initProject();
	}, []);

	const handleNewMessage = async (content: string) => {
		setIsProcessing(true);
		try {
			const newMessages = await handleChatMessage(
				content,
				currentProject?.id
			);
			setMessages((prev) => [...prev, ...newMessages]);

			// Handle any actions from the assistant's message
			const assistantMessage = newMessages[1];
			if (assistantMessage.action?.type === "create_project") {
				const projectId =
					assistantMessage.action.payload.projectId;
				if (projectId) {
					await loadProject(projectId);
					setActiveTab("code");
				}
			} else if (
				assistantMessage.action?.type === "update_file"
			) {
				const files = assistantMessage.action.payload.files;
				if (currentProject?.id) {
					await loadProject(currentProject.id);
					// Select the first updated file
					if (files && files.length > 0) {
						const updatedFile =
							currentProject.files?.find(
								(f) =>
									f.path ===
									files[0]
							);
						if (updatedFile) {
							setSelectedFile(updatedFile);
						}
					}
				}
			}
		} catch (error) {
			console.error("Failed to process message:", error);
			setMessages((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					content: "Sorry, something went wrong. Please try again.",
					role: "assistant",
					status: "error",
				},
			]);
		} finally {
			setIsProcessing(false);
		}
	};

	const loadProject = async (projectId: string) => {
		try {
			const project = await getProject(projectId);
			setCurrentProject(project);
			if (project.files.length > 0) {
				setSelectedFile(project.files[0]);
			}
		} catch (error) {
			console.error("Failed to load project:", error);
		}
	};

	const handleFileSelect = (file: ProjectFile) => {
		setSelectedFile(file);
	};

	return (
		<div className="flex h-screen bg-[#1E1E1E] text-white">
			{/* Left Sidebar - Chat */}
			<div className="w-80 border-r border-gray-800 flex flex-col">
				<div className="p-4 border-b border-gray-800">
					<h1 className="text-xl font-semibold">
						NoCode Builder
					</h1>
					{currentProject && (
						<p className="text-sm text-gray-400 mt-1">
							{currentProject.name}
						</p>
					)}
				</div>
				<div className="flex-1 overflow-y-auto p-4">
					<ChatMessages messages={messages} />
				</div>
				<div className="p-4 border-t border-gray-800">
					<ChatInput
						onSendMessage={handleNewMessage}
						isProcessing={isProcessing}
					/>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Top Navigation */}
				<div className="h-12 border-b border-gray-800 flex items-center px-4 bg-[#252526]">
					<div className="flex space-x-2">
						<button
							onClick={() =>
								setActiveTab("preview")
							}
							className={`px-4 py-1 rounded ${
								activeTab === "preview"
									? "bg-blue-500 text-white"
									: "text-gray-400 hover:text-white"
							}`}
						>
							Preview
						</button>
						<button
							onClick={() =>
								setActiveTab("code")
							}
							className={`px-4 py-1 rounded ${
								activeTab === "code"
									? "bg-blue-500 text-white"
									: "text-gray-400 hover:text-white"
							}`}
						>
							Code
						</button>
					</div>
				</div>

				{/* Content Area */}
				<div className="flex-1 overflow-hidden">
					{activeTab === "preview" ? (
						<div className="h-full w-full bg-white">
							{currentProject ? (
								<LivePreview
									projectFiles={
										currentProject.files
									}
								/>
							) : (
								<div className="h-full flex items-center justify-center text-gray-400">
									Loading
									preview...
								</div>
							)}
						</div>
					) : (
						<div className="h-full flex">
							{/* File Explorer */}
							<div className="w-64 bg-[#252526] border-r border-gray-800">
								<div className="p-2">
									{currentProject ? (
										<>
											<div className="text-sm text-gray-400">
												Project
												Files
											</div>
											<div className="pl-4 text-sm">
												{currentProject.files.map(
													(
														file
													) => (
														<div
															key={
																file.id
															}
															className={`text-gray-300 cursor-pointer hover:bg-[#2D2D2D] px-2 py-1 rounded ${
																selectedFile?.id ===
																file.id
																	? "bg-[#2D2D2D]"
																	: ""
															}`}
															onClick={() =>
																handleFileSelect(
																	file
																)
															}
														>
															{
																file.path
															}
														</div>
													)
												)}
											</div>
										</>
									) : (
										<div className="text-sm text-gray-400">
											Loading
											project
											files...
										</div>
									)}
								</div>
							</div>

							{/* Code Preview */}
							<div className="flex-1">
								{selectedFile ? (
									<CodePreview
										file={
											selectedFile
										}
									/>
								) : (
									<div className="h-full flex items-center justify-center text-gray-400">
										Select a
										file to
										view its
										code
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

