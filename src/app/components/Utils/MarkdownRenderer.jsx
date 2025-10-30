"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }) {
	// Limpiar el contenido (remover escapes)
	const cleanContent = content.replace(/\\n/g, "\n").replace(/\\"/g, '"');

	return (
		<div className="markdown-content">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					// Syntax highlighting para bloques de código
					code({ node, inline, className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || "");
						const language = match ? match[1] : "";

						if (!inline && language) {
							return (
								<SyntaxHighlighter
									style={vscDarkPlus}
									language={language}
									PreTag="div"
									className="code-block"
									showLineNumbers={true}
									customStyle={{
										background: "#1a1a1a",
										borderRadius: "8px",
										padding: "1.5rem",
										margin: "1.5rem 0",
										fontSize: "0.9rem"
									}}
									{...props}>
									{String(children).replace(/\n$/, "")}
								</SyntaxHighlighter>
							);
						}

						// Código inline
						return (
							<code
								className="inline-code"
								{...props}>
								{children}
							</code>
						);
					},

					// Personalizar headings
					h1: ({ node, ...props }) => (
						<h1
							className="markdown-h1"
							{...props}
						/>
					),
					h2: ({ node, ...props }) => (
						<h2
							className="markdown-h2"
							{...props}
						/>
					),
					h3: ({ node, ...props }) => (
						<h3
							className="markdown-h3"
							{...props}
						/>
					),

					// Personalizar enlaces
					a: ({ node, ...props }) => (
						<a
							className="markdown-link"
							target="_blank"
							rel="noopener noreferrer"
							{...props}
						/>
					),

					// Personalizar tablas
					table: ({ node, ...props }) => (
						<div className="table-container">
							<table
								className="markdown-table"
								{...props}
							/>
						</div>
					)
				}}>
				{cleanContent}
			</ReactMarkdown>
		</div>
	);
}
