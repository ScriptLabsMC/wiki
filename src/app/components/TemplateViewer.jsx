"use client";

import { useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import FileExplorer from "./FileExplorer";

export default function TemplateViewer({ template }) {
	const [activeTab, setActiveTab] = useState("readme");
	const [selectedFile, setSelectedFile] = useState(null);

	return (
		<div className="template-page">
			<header className="template-header">
				<h1>{template.title}</h1>
				<div className="template-meta">
					<span>Por {template.author}</span>
					<span>v{template.version}</span>
					<span>{template.license}</span>
				</div>
			</header>

			<div className="template-layout">
				<aside className="template-sidebar">
					<FileExplorer
						files={template.files}
						onFileSelect={setSelectedFile}
						selectedFile={selectedFile}
					/>
				</aside>

				<main className="template-content">
					<nav className="template-tabs">
						<button
							className={activeTab === "readme" ? "active" : ""}
							onClick={() => setActiveTab("readme")}>
							Documentación
						</button>
						<button
							className={activeTab === "files" ? "active" : ""}
							onClick={() => setActiveTab("files")}>
							Archivos
						</button>
						<button
							className={activeTab === "preview" ? "active" : ""}
							onClick={() => setActiveTab("preview")}>
							Vista Previa
						</button>
					</nav>

					<div className="tab-content">
						{activeTab === "readme" && (
							<MarkdownRenderer content={template.content} />
						)}

						{activeTab === "files" && selectedFile && (
							<FileViewer file={selectedFile} />
						)}

						{activeTab === "preview" && (
							<TemplatePreview template={template} />
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
