"use client";

import { useState } from "react";

interface ChatInputProps {
	onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
	const [message, setMessage] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;

		onSendMessage(message);
		setMessage("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex gap-2"
		>
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Type your prompt here..."
				className="flex-1 px-4 py-2 bg-[#2D2D2D] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
				type="submit"
				className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				Send
			</button>
		</form>
	);
}

