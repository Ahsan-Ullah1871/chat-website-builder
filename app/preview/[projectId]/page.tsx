"use server";

import { getProject } from "@/lib/project/projectManager";
import { notFound } from "next/navigation";
import LivePreview from "@/components/preview/LivePreview";

export default async function PreviewPage({
	params,
}: {
	params: { projectId: string };
}) {
	const project = await getProject(params.projectId);

	if (!project) {
		notFound();
	}

	return (
		<div className="w-full h-full">
			<LivePreview project={project} />
		</div>
	);
}

