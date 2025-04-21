export interface ProjectFile {
	id: string;
	project_id: string;
	path: string;
	content: string;
	created_at: string;
	updated_at: string;
}

export interface Project {
	id: string;
	name: string;
	description?: string;
	created_at: string;
	updated_at: string;
	files: ProjectFile[];
}

// Default project template
export const DEFAULT_PROJECT = {
	name: "My Next.js App",
	description: "A new Next.js application",
};

// Default files for a new project
export const DEFAULT_FILES: Omit<
	ProjectFile,
	"id" | "project_id" | "created_at" | "updated_at"
>[] = [
	{
		path: "app/page.tsx",
		content: `"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
	const [count, setCount] = useState(0);

	return (
		<main className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
			<Card className="p-8 max-w-md w-full">
				<h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your App</h1>
				<p className="text-gray-600 mb-6">Start building your amazing application!</p>
				<Button onClick={() => setCount(count + 1)}>
					Count: {count}
				</Button>
			</Card>
		</main>
	);
}`,
	},
	{
		path: "app/home/page.tsx",
		content: `"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
	const [count, setCount] = useState(0);

	return (
		<main className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
			<Card className="p-8 max-w-md w-full">
				<h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your App</h1>
				<p className="text-gray-600 mb-6">Start building your amazing application!</p>
				<Button onClick={() => setCount(count + 1)}>
					Count: {count}
				</Button>
			</Card>
		</main>
	);
}`,
	},
	{
		path: "app/globals.css",
		content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
	--foreground-rgb: 0, 0, 0;
	--background-start-rgb: 214, 219, 220;
	--background-end-rgb: 255, 255, 255;
}

body {
	color: rgb(var(--foreground-rgb));
	background: white;
}`,
	},
	{
		path: "app/layout.tsx",
		content: `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Your App",
	description: "Created with NoCode Builder",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}`,
	},
	{
		path: "components/ui/button.tsx",
		content: `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline';
	size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
	children, 
	variant = 'primary', 
	size = 'md', 
	className = '',
	...props 
}: ButtonProps) {
	const baseStyles = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
	
	const variants = {
		primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
		secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
		outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	};

	return (
		<button
			className={\`\${baseStyles} \${variants[variant]} \${sizes[size]} \${className}\`}
			{...props}
		>
			{children}
		</button>
	);
}`,
	},
	{
		path: "components/ui/card.tsx",
		content: `interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ 
	children, 
	className = '',
	...props 
}: CardProps) {
	return (
		<div
			className={\`bg-white rounded-xl shadow-2xl \${className}\`}
			{...props}
		>
			{children}
		</div>
	);
}`,
	},
	{
		path: "tailwind.config.ts",
		content: `import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {},
	},
	plugins: [],
};

export default config;`,
	},
	{
		path: "package.json",
		content: `{
	"name": "nextjs-app",
	"version": "0.1.0",
	"private": true,
	"scripts": {
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"lint": "next lint"
	},
	"dependencies": {
		"next": "15.3.1",
		"react": "^19.0.0",
		"react-dom": "^19.0.0",
		"tailwindcss": "^3.4.1",
		"postcss": "^8",
		"autoprefixer": "^10.0.1"
	}
}`,
	},
	{
		path: "next.config.ts",
		content: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */

	images: {
		remotePatterns: [
			{
				hostname: "**",
			},
		],
	},
};

export default nextConfig;

`,
	},
	{
		path: "next-env.d.ts",
		content: `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.`,
	},
	{
		path: "tsconfig.json",
		content: `
		{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`,
	},
];

