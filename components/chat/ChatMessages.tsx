"use client";

import { Message } from '../../lib/chat/types';

interface ChatMessagesProps {
	messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
	return (
		<div className="space-y-4">
			{messages.map((message) => (
				<div
					key={message.id}
					className={`p-4 rounded-lg ${
						message.role === "user"
							? "bg-[#2D2D2D] ml-4"
							: "bg-[#1E1E1E] border border-gray-700 mr-4"
					}`}
				>
					<div className="flex justify-between items-center mb-2">
						<div className="text-xs text-gray-400">
							{message.role === "user" ? "You" : "Assistant"}
						</div>
						{message.status && (
							<div className={`text-xs ${
								message.status === 'error' ? 'text-red-400' :
								message.status === 'loading' ? 'text-blue-400' :
								'text-green-400'
							}`}>
								{message.status}
							</div>
						)}
					</div>
					<p className="text-sm text-gray-200">{message.content}</p>
					{message.action && (
						<div className="mt-2 text-xs text-blue-400">
							Action: {message.action.type}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
