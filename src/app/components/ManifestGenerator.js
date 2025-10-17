"use client";

import { useState } from "react";

export default function ManifestGenerator() {
	const [manifest, setManifest] = useState({
		format_version: 2,
		// metadata va aquí, no dentro de otro objeto
		metadata: {
			authors: [],
			license: "",
			url: ""
		},
		header: {
			name: "",
			description: "",
			uuid: "",
			version: [1, 0, 0],
			min_engine_version: [1, 21, 90] // Actualiza a versión más reciente
		},
		modules: [],
		dependencies: [],
		capabilities: [],
		subpacks: []
	});

	const [currentModule, setCurrentModule] = useState({
		uuid: "",
		description: "",
		version: [1, 0, 0],
		type: "data",
		language: "javascript",
		entry: ""
	});

	const [currentDep, setCurrentDep] = useState({
		uuid: "",
		version: [1, 0, 0],
		module_name: "",
		version_string: ""
	});

	const [currentSubpack, setCurrentSubpack] = useState({
		folder_name: "",
		name: "",
		memory_tier: 0
	});

	const [showPreview, setShowPreview] = useState(false);
	const [authorInput, setAuthorInput] = useState("");
	const [depType, setDepType] = useState("uuid"); // "uuid" or "module"

	// Generar UUID v4
	const generateUUID = () => {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0;
			const v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	};

	const updateHeader = (field, value) => {
		setManifest((prev) => ({
			...prev,
			header: { ...prev.header, [field]: value }
		}));
	};

	const updateVersion = (type, index, value) => {
		const val = parseInt(value) || 0;
		if (type === "header") {
			const newVersion = [...manifest.header.version];
			newVersion[index] = val;
			updateHeader("version", newVersion);
		} else if (type === "min_engine") {
			const newVersion = [...manifest.header.min_engine_version];
			newVersion[index] = val;
			updateHeader("min_engine_version", newVersion);
		} else if (type === "module") {
			const newVersion = [...currentModule.version];
			newVersion[index] = val;
			setCurrentModule((prev) => ({ ...prev, version: newVersion }));
		} else if (type === "dependency") {
			if (depType === "uuid") {
				const newVersion = [...currentDep.version];
				newVersion[index] = val;
				setCurrentDep((prev) => ({ ...prev, version: newVersion }));
			}
		}
	};

	const addModule = () => {
		if (currentModule.uuid && currentModule.type) {
			// Si es un script module, asegurarse de que tenga entry point
			if (currentModule.type === "script" && !currentModule.entry) {
				alert(
					"Los script modules requieren un entry point (ej: scripts/main.js)"
				);
				return;
			}

			const moduleData = { ...currentModule };

			// Limpiar campos que no son necesarios según el tipo
			if (currentModule.type !== "script") {
				delete moduleData.language;
				delete moduleData.entry;
			}

			setManifest((prev) => ({
				...prev,
				modules: [...prev.modules, moduleData]
			}));
			setCurrentModule({
				uuid: "",
				description: "",
				version: [1, 0, 0],
				type: "data",
				language: "javascript",
				entry: ""
			});
		}
	};

	const removeModule = (index) => {
		setManifest((prev) => ({
			...prev,
			modules: prev.modules.filter((_, i) => i !== index)
		}));
	};

	const addDependency = () => {
		if (
			(depType === "uuid" && currentDep.uuid) ||
			(depType === "module" &&
				currentDep.module_name &&
				currentDep.version_string)
		) {
			let depData;

			if (depType === "module") {
				// Para módulos como @minecraft/server
				depData = {
					module_name: currentDep.module_name,
					version: currentDep.version_string
				};
			} else {
				// Para dependencias por UUID
				depData = {
					uuid: currentDep.uuid,
					version: currentDep.version
				};
			}

			setManifest((prev) => ({
				...prev,
				dependencies: [...prev.dependencies, depData]
			}));
			setCurrentDep({
				uuid: "",
				version: [1, 0, 0],
				module_name: "",
				version_string: ""
			});
		}
	};

	const removeDependency = (index) => {
		setManifest((prev) => ({
			...prev,
			dependencies: prev.dependencies.filter((_, i) => i !== index)
		}));
	};

	const addSubpack = () => {
		if (currentSubpack.folder_name && currentSubpack.name) {
			setManifest((prev) => ({
				...prev,
				subpacks: [...prev.subpacks, { ...currentSubpack }]
			}));
			setCurrentSubpack({
				folder_name: "",
				name: "",
				memory_tier: 0
			});
		}
	};

	const removeSubpack = (index) => {
		setManifest((prev) => ({
			...prev,
			subpacks: prev.subpacks.filter((_, i) => i !== index)
		}));
	};

	const addAuthor = () => {
		if (authorInput.trim()) {
			setManifest((prev) => ({
				...prev,
				metadata: {
					...prev.metadata,
					authors: [...prev.metadata.authors, authorInput.trim()]
				}
			}));
			setAuthorInput("");
		}
	};

	const removeAuthor = (index) => {
		setManifest((prev) => ({
			...prev,
			metadata: {
				...prev.metadata,
				authors: prev.metadata.authors.filter((_, i) => i !== index)
			}
		}));
	};

	const toggleCapability = (cap) => {
		setManifest((prev) => ({
			...prev,
			capabilities: prev.capabilities.includes(cap)
				? prev.capabilities.filter((c) => c !== cap)
				: [...prev.capabilities, cap]
		}));
	};

	const downloadManifest = () => {
		const cleanManifest = {
			format_version: manifest.format_version,
			...((manifest.metadata.authors.length > 0 ||
				manifest.metadata.license ||
				manifest.metadata.url) && {
				metadata: {
					...(manifest.metadata.authors.length > 0 && {
						authors: manifest.metadata.authors
					}),
					...(manifest.metadata.license && {
						license: manifest.metadata.license
					}),
					...(manifest.metadata.url && {
						url: manifest.metadata.url
					}),
					generated_with: {
						tool: "Manifest Generator",
						version: "1.0.0"
					}
				}
			}),
			header: manifest.header,
			modules: manifest.modules,
			...(manifest.dependencies.length > 0 && {
				dependencies: manifest.dependencies
			}),
			...(manifest.capabilities.length > 0 && {
				capabilities: manifest.capabilities
			}),
			...(manifest.subpacks.length > 0 && {
				subpacks: manifest.subpacks
			})
		};

		const blob = new Blob([JSON.stringify(cleanManifest, null, 2)], {
			type: "application/json"
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "manifest.json";
		a.click();
	};

	return (
		<div
			style={{
				padding: "30px 20px",
				maxWidth: "1200px",
				margin: "0 auto"
			}}>
			{/* Header */}
			<div style={{ textAlign: "center", marginBottom: "3rem" }}>
				<h1
					className="gradient-text"
					style={{ fontSize: "2.5rem", margin: "0 0 1rem 0" }}>
					📦 Manifest Generator
				</h1>
				<p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
					Crea manifests para tus add-ons de Minecraft Bedrock de
					forma rápida y sin errores
				</p>
			</div>

			{/* Actions Bar */}
			<div
				style={{
					display: "flex",
					gap: "1rem",
					marginBottom: "2rem",
					justifyContent: "center",
					flexWrap: "wrap"
				}}>
				<button
					className="btn btn-primary"
					onClick={() => setShowPreview(!showPreview)}>
					{showPreview ? "📝 Editor" : "👁️ Preview"}
				</button>
				<button
					className="btn btn-ghost"
					onClick={downloadManifest}
					disabled={
						!manifest.header.name ||
						!manifest.header.uuid ||
						manifest.modules.length === 0
					}>
					💾 Descargar manifest.json
				</button>
			</div>

			{!showPreview ? (
				<div style={{ display: "grid", gap: "2rem" }}>
					{/* Header Section */}
					<div className="card glass">
						<h2
							style={{
								color: "var(--primary)",
								marginBottom: "1.5rem",
								display: "flex",
								alignItems: "center",
								gap: "0.5rem"
							}}>
							📋 Header (Información Principal)
						</h2>

						<div style={{ display: "grid", gap: "1.5rem" }}>
							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										color: "var(--text)",
										fontWeight: "600"
									}}>
									Nombre del Pack *
								</label>
								<input
									type="text"
									value={manifest.header.name}
									onChange={(e) =>
										updateHeader("name", e.target.value)
									}
									placeholder="Mi Increíble Add-on"
									style={{
										width: "100%",
										padding: "0.75rem",
										background: "rgba(255, 255, 255, 0.05)",
										border: "1px solid var(--border)",
										borderRadius: "8px",
										color: "var(--text)",
										fontSize: "1rem"
									}}
								/>
							</div>

							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										color: "var(--text)",
										fontWeight: "600"
									}}>
									Descripción *
								</label>
								<textarea
									value={manifest.header.description}
									onChange={(e) =>
										updateHeader(
											"description",
											e.target.value
										)
									}
									placeholder="Una breve descripción de tu add-on..."
									rows={3}
									style={{
										width: "100%",
										padding: "0.75rem",
										background: "rgba(255, 255, 255, 0.05)",
										border: "1px solid var(--border)",
										borderRadius: "8px",
										color: "var(--text)",
										fontSize: "1rem",
										resize: "vertical"
									}}
								/>
							</div>

							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										color: "var(--text)",
										fontWeight: "600"
									}}>
									UUID del Pack *
								</label>
								<div style={{ display: "flex", gap: "0.5rem" }}>
									<input
										type="text"
										value={manifest.header.uuid}
										onChange={(e) =>
											updateHeader("uuid", e.target.value)
										}
										placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
										style={{
											flex: 1,
											padding: "0.75rem",
											background:
												"rgba(255, 255, 255, 0.05)",
											border: "1px solid var(--border)",
											borderRadius: "8px",
											color: "var(--text)",
											fontSize: "0.9rem",
											fontFamily: "monospace"
										}}
									/>
									<button
										className="btn btn-ghost"
										onClick={() =>
											updateHeader("uuid", generateUUID())
										}
										style={{ whiteSpace: "nowrap" }}>
										🎲 Generar
									</button>
								</div>
							</div>

							<div
								style={{
									display: "grid",
									gridTemplateColumns:
										"repeat(auto-fit, minmax(200px, 1fr))",
									gap: "1rem"
								}}>
								<div>
									<label
										style={{
											display: "block",
											marginBottom: "0.5rem",
											color: "var(--text)",
											fontWeight: "600"
										}}>
										Versión del Pack
									</label>
									<div
										style={{
											display: "flex",
											gap: "0.5rem",
											alignItems: "center"
										}}>
										<input
											type="number"
											value={manifest.header.version[0]}
											onChange={(e) =>
												updateVersion(
													"header",
													0,
													e.target.value
												)
											}
											min="0"
											style={{
												width: "60px",
												padding: "0.5rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border)",
												borderRadius: "6px",
												color: "var(--text)",
												textAlign: "center"
											}}
										/>
										<span style={{ color: "var(--muted)" }}>
											.
										</span>
										<input
											type="number"
											value={manifest.header.version[1]}
											onChange={(e) =>
												updateVersion(
													"header",
													1,
													e.target.value
												)
											}
											min="0"
											style={{
												width: "60px",
												padding: "0.5rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border)",
												borderRadius: "6px",
												color: "var(--text)",
												textAlign: "center"
											}}
										/>
										<span style={{ color: "var(--muted)" }}>
											.
										</span>
										<input
											type="number"
											value={manifest.header.version[2]}
											onChange={(e) =>
												updateVersion(
													"header",
													2,
													e.target.value
												)
											}
											min="0"
											style={{
												width: "60px",
												padding: "0.5rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border)",
												borderRadius: "6px",
												color: "var(--text)",
												textAlign: "center"
											}}
										/>
									</div>
								</div>

								<div>
									<label
										style={{
											display: "block",
											marginBottom: "0.5rem",
											color: "var(--text)",
											fontWeight: "600"
										}}>
										Versión Mínima de Minecraft
									</label>
									<div
										style={{
											display: "flex",
											gap: "0.5rem",
											alignItems: "center"
										}}>
										<input
											type="number"
											value={
												manifest.header
													.min_engine_version[0]
											}
											onChange={(e) =>
												updateVersion(
													"min_engine",
													0,
													e.target.value
												)
											}
											min="1"
											style={{
												width: "60px",
												padding: "0.5rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border)",
												borderRadius: "6px",
												color: "var(--text)",
												textAlign: "center"
											}}
										/>
										<span style={{ color: "var(--muted)" }}>
											.
										</span>
										<input
											type="number"
											value={
												manifest.header
													.min_engine_version[1]
											}
											onChange={(e) =>
												updateVersion(
													"min_engine",
													1,
													e.target.value
												)
											}
											min="0"
											style={{
												width: "60px",
												padding: "0.5rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border)",
												borderRadius: "6px",
												color: "var(--text)",
												textAlign: "center"
											}}
										/>
										<span style={{ color: "var(--muted)" }}>
											.
										</span>
										<input
											type="number"
											value={
												manifest.header
													.min_engine_version[2]
											}
											onChange={(e) =>
												updateVersion(
													"min_engine",
													2,
													e.target.value
												)
											}
											min="0"
											style={{
												width: "60px",
												padding: "0.5rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border)",
												borderRadius: "6px",
												color: "var(--text)",
												textAlign: "center"
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Modules Section */}
					<div className="card glass">
						<h2
							style={{
								color: "var(--primary)",
								marginBottom: "1.5rem",
								display: "flex",
								alignItems: "center",
								gap: "0.5rem"
							}}>
							🧩 Módulos *
						</h2>

						{manifest.modules.length > 0 && (
							<div
								style={{
									marginBottom: "1.5rem",
									display: "grid",
									gap: "1rem"
								}}>
								{manifest.modules.map((mod, idx) => (
									<div
										key={idx}
										style={{
											padding: "1rem",
											background:
												"rgba(8, 255, 200, 0.05)",
											border: "1px solid var(--primary)",
											borderRadius: "8px",
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center"
										}}>
										<div>
											<div
												style={{
													color: "var(--text)",
													fontWeight: "600",
													marginBottom: "0.25rem"
												}}>
												{mod.type === "data"
													? "📦 Behavior Pack"
													: mod.type === "resources"
													? "🎨 Resource Pack"
													: mod.type === "script"
													? "📜 Script Module"
													: `📝 ${mod.type}`}
											</div>
											<div
												style={{
													color: "var(--muted)",
													fontSize: "0.85rem",
													fontFamily: "monospace"
												}}>
												{mod.uuid} • v
												{mod.version.join(".")}
												{mod.type === "script" && (
													<>
														<br />
														Entry: {mod.entry} •
														Language: {mod.language}
													</>
												)}
											</div>
											{mod.description && (
												<div
													style={{
														color: "var(--muted)",
														fontSize: "0.9rem",
														marginTop: "0.25rem"
													}}>
													{mod.description}
												</div>
											)}
										</div>
										<button
											onClick={() => removeModule(idx)}
											style={{
												background: "transparent",
												border: "none",
												color: "#ff5e62",
												cursor: "pointer",
												fontSize: "1.2rem",
												padding: "0.5rem"
											}}>
											✕
										</button>
									</div>
								))}
							</div>
						)}

						<div
							style={{
								display: "grid",
								gap: "1rem",
								padding: "1rem",
								background: "rgba(255, 255, 255, 0.02)",
								borderRadius: "8px"
							}}>
							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										color: "var(--text)",
										fontWeight: "600"
									}}>
									Tipo de Módulo
								</label>
								<select
									value={currentModule.type}
									onChange={(e) =>
										setCurrentModule((prev) => ({
											...prev,
											type: e.target.value,
											// Resetear campos específicos de script si se cambia el tipo
											...(e.target.value !== "script" && {
												language: "javascript",
												entry: ""
											})
										}))
									}
									style={{
										width: "100%",
										padding: "0.75rem",
										background: "rgba(255, 255, 255, 0.05)",
										border: "1px solid var(--border)",
										borderRadius: "8px",
										color: "var(--text)",
										fontSize: "1rem"
									}}>
									<option value="data">
										Behavior Pack (data)
									</option>
									<option value="resources">
										Resource Pack (resources)
									</option>
									<option value="script">
										Script Module (script)
									</option>
									<option value="client_data">
										Client Data
									</option>
									<option value="interface">Interface</option>
									<option value="world_template">
										World Template
									</option>
								</select>
							</div>

							{currentModule.type === "script" && (
								<>
									<div>
										<label
											style={{
												display: "block",
												marginBottom: "0.5rem",
												color: "var(--text)",
												fontWeight: "600"
											}}>
											Lenguaje
										</label>
										<select
											value={currentModule.language}
											onChange={(e) =>
												setCurrentModule((prev) => ({
													...prev,
													language: e.target.value
												}))
											}
											style={{
												width: "100%",
												padding: "0.75rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border)",
												borderRadius: "8px",
												color: "var(--text)",
												fontSize: "1rem"
											}}>
											<option value="javascript">
												JavaScript
											</option>
											<option value="typescript">
												TypeScript
											</option>
										</select>
									</div>

									<div>
										<label
											style={{
												display: "block",
												marginBottom: "0.5rem",
												color: "var(--text)",
												fontWeight: "600"
											}}>
											Entry Point *
										</label>
										<input
											type="text"
											value={currentModule.entry}
											onChange={(e) =>
												setCurrentModule((prev) => ({
													...prev,
													entry: e.target.value
												}))
											}
											placeholder="scripts/main.js"
											style={{
												width: "100%",
												padding: "0.75rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border)",
												borderRadius: "8px",
												color: "var(--text)",
												fontSize: "1rem"
											}}
										/>
										<small
											style={{
												color: "var(--muted)",
												marginTop: "0.25rem",
												display: "block"
											}}>
											Ruta al archivo principal de scripts
											(ej: scripts/main.js)
										</small>
									</div>
								</>
							)}

							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										color: "var(--text)",
										fontWeight: "600"
									}}>
									UUID del Módulo
								</label>
								<div style={{ display: "flex", gap: "0.5rem" }}>
									<input
										type="text"
										value={currentModule.uuid}
										onChange={(e) =>
											setCurrentModule((prev) => ({
												...prev,
												uuid: e.target.value
											}))
										}
										placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
										style={{
											flex: 1,
											padding: "0.75rem",
											background:
												"rgba(255, 255, 255, 0.05)",
											border: "1px solid var(--border)",
											borderRadius: "8px",
											color: "var(--text)",
											fontSize: "0.9rem",
											fontFamily: "monospace"
										}}
									/>
									<button
										className="btn btn-ghost"
										onClick={() =>
											setCurrentModule((prev) => ({
												...prev,
												uuid: generateUUID()
											}))
										}
										style={{ whiteSpace: "nowrap" }}>
										🎲
									</button>
								</div>
							</div>

							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										color: "var(--text)",
										fontWeight: "600"
									}}>
									Descripción (opcional)
								</label>
								<input
									type="text"
									value={currentModule.description}
									onChange={(e) =>
										setCurrentModule((prev) => ({
											...prev,
											description: e.target.value
										}))
									}
									placeholder="Descripción del módulo..."
									style={{
										width: "100%",
										padding: "0.75rem",
										background: "rgba(255, 255, 255, 0.05)",
										border: "1px solid var(--border)",
										borderRadius: "8px",
										color: "var(--text)",
										fontSize: "1rem"
									}}
								/>
							</div>

							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										color: "var(--text)",
										fontWeight: "600"
									}}>
									Versión del Módulo
								</label>
								<div
									style={{
										display: "flex",
										gap: "0.5rem",
										alignItems: "center"
									}}>
									<input
										type="number"
										value={currentModule.version[0]}
										onChange={(e) =>
											updateVersion(
												"module",
												0,
												e.target.value
											)
										}
										min="0"
										style={{
											width: "70px",
											padding: "0.5rem",
											background:
												"rgba(255, 255, 255, 0.05)",
											border: "1px solid var(--border)",
											borderRadius: "6px",
											color: "var(--text)",
											textAlign: "center"
										}}
									/>
									<span style={{ color: "var(--muted)" }}>
										.
									</span>
									<input
										type="number"
										value={currentModule.version[1]}
										onChange={(e) =>
											updateVersion(
												"module",
												1,
												e.target.value
											)
										}
										min="0"
										style={{
											width: "70px",
											padding: "0.5rem",
											background:
												"rgba(255, 255, 255, 0.05)",
											border: "1px solid var(--border)",
											borderRadius: "6px",
											color: "var(--text)",
											textAlign: "center"
										}}
									/>
									<span style={{ color: "var(--muted)" }}>
										.
									</span>
									<input
										type="number"
										value={currentModule.version[2]}
										onChange={(e) =>
											updateVersion(
												"module",
												2,
												e.target.value
											)
										}
										min="0"
										style={{
											width: "70px",
											padding: "0.5rem",
											background:
												"rgba(255, 255, 255, 0.05)",
											border: "1px solid var(--border)",
											borderRadius: "6px",
											color: "var(--text)",
											textAlign: "center"
										}}
									/>
								</div>
							</div>

							<button
								className="btn btn-primary"
								onClick={addModule}
								disabled={
									!currentModule.uuid ||
									!currentModule.type ||
									(currentModule.type === "script" &&
										!currentModule.entry)
								}
								style={{ width: "100%" }}>
								➕ Agregar Módulo
							</button>
						</div>
					</div>

					{/* Dependencies Section */}
					<div className="card glass">
						<h2
							style={{
								color: "var(--primary)",
								marginBottom: "1.5rem",
								display: "flex",
								alignItems: "center",
								gap: "0.5rem"
							}}>
							🔗 Dependencias (opcional)
						</h2>

						{manifest.dependencies.length > 0 && (
							<div
								style={{
									marginBottom: "1.5rem",
									display: "grid",
									gap: "1rem"
								}}>
								{manifest.dependencies.map((dep, idx) => (
									<div
										key={idx}
										style={{
											padding: "1rem",
											background:
												"rgba(0, 162, 255, 0.05)",
											border: "1px solid var(--accent1)",
											borderRadius: "8px",
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center"
										}}>
										<div>
											{dep.uuid ? (
												<>
													<div
														style={{
															color: "var(--text)",
															fontFamily:
																"monospace",
															fontSize: "0.9rem"
														}}>
														{dep.uuid}
													</div>
													<div
														style={{
															color: "var(--muted)",
															fontSize: "0.85rem"
														}}>
														Versión:{" "}
														{Array.isArray(
															dep.version
														)
															? dep.version.join(
																	"."
															  )
															: dep.version}
													</div>
												</>
											) : (
												<>
													<div
														style={{
															color: "var(--text)",
															fontFamily:
																"monospace",
															fontSize: "0.9rem"
														}}>
														{dep.module_name}
													</div>
													<div
														style={{
															color: "var(--muted)",
															fontSize: "0.85rem"
														}}>
														Versión: {dep.version}
													</div>
												</>
											)}
										</div>
										<button
											onClick={() =>
												removeDependency(idx)
											}
											style={{
												background: "transparent",
												border: "none",
												color: "#ff5e62",
												cursor: "pointer",
												fontSize: "1.2rem",
												padding: "0.5rem"
											}}>
											✕
										</button>
									</div>
								))}
							</div>
						)}

						<div
							style={{
								display: "grid",
								gap: "1rem",
								padding: "1rem",
								background: "rgba(255, 255, 255, 0.02)",
								borderRadius: "8px"
							}}>
							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										color: "var(--text)",
										fontWeight: "600"
									}}>
									Tipo de Dependencia
								</label>
								<select
									value={depType}
									onChange={(e) => setDepType(e.target.value)}
									style={{
										width: "100%",
										padding: "0.75rem",
										background: "rgba(255, 255, 255, 0.05)",
										border: "1px solid var(--border)",
										borderRadius: "8px",
										color: "var(--text)",
										fontSize: "1rem"
									}}>
									<option value="uuid">
										Por UUID (Otro Pack)
									</option>
									<option value="module">
										Por Módulo (@minecraft/server)
									</option>
								</select>
							</div>

							{depType === "uuid" ? (
								<>
									<div>
										<label
											style={{
												display: "block",
												marginBottom: "0.5rem",
												color: "var(--text)",
												fontWeight: "600"
											}}>
											UUID del Pack Dependiente
										</label>
										<input
											type="text"
											value={currentDep.uuid}
											onChange={(e) =>
												setCurrentDep((prev) => ({
													...prev,
													uuid: e.target.value
												}))
											}
											placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
											style={{
												width: "100%",
												padding: "0.75rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border)",
												borderRadius: "8px",
												color: "var(--text)",
												fontSize: "0.9rem",
												fontFamily: "monospace"
											}}
										/>
									</div>

									<div>
										<label
											style={{
												display: "block",
												marginBottom: "0.5rem",
												color: "var(--text)",
												fontWeight: "600"
											}}>
											Versión Requerida
										</label>
										<div
											style={{
												display: "flex",
												gap: "0.5rem",
												alignItems: "center"
											}}>
											<input
												type="number"
												value={currentDep.version[0]}
												onChange={(e) =>
													updateVersion(
														"dependency",
														0,
														e.target.value
													)
												}
												min="0"
												style={{
													width: "70px",
													padding: "0.5rem",
													background:
														"rgba(255, 255, 255, 0.05)",
													border: "1px solid var(--border)",
													borderRadius: "6px",
													color: "var(--text)",
													textAlign: "center"
												}}
											/>
											<span
												style={{
													color: "var(--muted)"
												}}>
												.
											</span>
											<input
												type="number"
												value={currentDep.version[1]}
												onChange={(e) =>
													updateVersion(
														"dependency",
														1,
														e.target.value
													)
												}
												min="0"
												style={{
													width: "70px",
													padding: "0.5rem",
													background:
														"rgba(255, 255, 255, 0.05)",
													border: "1px solid var(--border)",
													borderRadius: "6px",
													color: "var(--text)",
													textAlign: "center"
												}}
											/>
											<span
												style={{
													color: "var(--muted)"
												}}>
												.
											</span>
											<input
												type="number"
												value={currentDep.version[2]}
												onChange={(e) =>
													updateVersion(
														"dependency",
														2,
														e.target.value
													)
												}
												min="0"
												style={{
													width: "70px",
													padding: "0.5rem",
													background:
														"rgba(255, 255, 255, 0.05)",
													border: "1px solid var(--border)",
													borderRadius: "6px",
													color: "var(--text)",
													textAlign: "center"
												}}
											/>
										</div>
									</div>
								</>
							) : (
								<>
									<div>
										<label
											style={{
												display: "block",
												marginBottom: "0.5rem",
												color: "var(--text)",
												fontWeight: "600"
											}}>
											Nombre del Módulo
										</label>
										<select
											value={currentDep.module_name}
											onChange={(e) =>
												setCurrentDep((prev) => ({
													...prev,
													module_name: e.target.value
												}))
											}
											style={{
												width: "100%",
												padding: "0.75rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border)",
												borderRadius: "8px",
												color: "var(--text)",
												fontSize: "1rem"
											}}>
											<option value="">
												Seleccionar módulo
											</option>
											<option value="@minecraft/server">
												@minecraft/server
											</option>
											<option value="@minecraft/vanilla-data">
												@minecraft/vanilla-data
											</option>
											<option value="@minecraft/server-ui">
												@minecraft/server-ui
											</option>
											<option value="@minecraft/server-admin">
												@minecraft/server-admin
											</option>
											<option value="@minecraft/server-net">
												@minecraft/server-net
											</option>
											<option value="@minecraft/server-gametest">
												@minecraft/server-gametest
											</option>
										</select>
									</div>

									<div>
										<label
											style={{
												display: "block",
												marginBottom: "0.5rem",
												color: "var(--text)",
												fontWeight: "600"
											}}>
											Versión
										</label>
										<input
											type="text"
											value={currentDep.version_string}
											onChange={(e) =>
												setCurrentDep((prev) => ({
													...prev,
													version_string:
														e.target.value
												}))
											}
											placeholder="1.0.0"
											style={{
												width: "100%",
												padding: "0.75rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border)",
												borderRadius: "8px",
												color: "var(--text)",
												fontSize: "1rem"
											}}
										/>
										<small
											style={{
												color: "var(--muted)",
												marginTop: "0.25rem",
												display: "block"
											}}>
											Usa formato semántico: 1.0.0, 2.1.0,
											etc.
										</small>
									</div>
								</>
							)}

							<button
								className="btn btn-primary"
								onClick={addDependency}
								disabled={
									(depType === "uuid" && !currentDep.uuid) ||
									(depType === "module" &&
										(!currentDep.module_name ||
											!currentDep.version_string))
								}
								style={{ width: "100%" }}>
								➕ Agregar Dependencia
							</button>
						</div>
					</div>

					{/* Subpacks Section */}
					<div className="card glass">
						<h2
							style={{
								color: "var(--primary)",
								marginBottom: "1.5rem",
								display: "flex",
								alignItems: "center",
								gap: "0.5rem"
							}}>
							📁 Subpacks (opcional)
						</h2>

						{manifest.subpacks.length > 0 && (
							<div
								style={{
									marginBottom: "1.5rem",
									display: "grid",
									gap: "1rem"
								}}>
								{manifest.subpacks.map((subpack, idx) => (
									<div
										key={idx}
										style={{
											padding: "1rem",
											background:
												"rgba(255, 193, 7, 0.05)",
											border: "1px solid #ffc107",
											borderRadius: "8px",
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center"
										}}>
										<div>
											<div
												style={{
													color: "var(--text)",
													fontWeight: "600",
													marginBottom: "0.25rem"
												}}>
												{subpack.name}
											</div>
											<div
												style={{
													color: "var(--muted)",
													fontSize: "0.85rem",
													fontFamily: "monospace"
												}}>
												Carpeta: {subpack.folder_name}
												{subpack.memory_tier > 0 &&
													` • Memory Tier: ${subpack.memory_tier}`}
											</div>
										</div>
										<button
											onClick={() => removeSubpack(idx)}
											style={{
												background: "transparent",
												border: "none",
												color: "#ff5e62",
												cursor: "pointer",
												fontSize: "1.2rem",
												padding: "0.5rem"
											}}>
											✕
										</button>
									</div>
								))}
							</div>
						)}

						<div
							style={{
								display: "grid",
								gap: "1rem",
								padding: "1rem",
								background: "rgba(255, 255, 255, 0.02)",
								borderRadius: "8px"
							}}>
							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										color: "var(--text)",
										fontWeight: "600"
									}}>
									Nombre del Subpack *
								</label>
								<input
									type="text"
									value={currentSubpack.name}
									onChange={(e) =>
										setCurrentSubpack((prev) => ({
											...prev,
											name: e.target.value
										}))
									}
									placeholder="Mi Subpack"
									style={{
										width: "100%",
										padding: "0.75rem",
										background: "rgba(255, 255, 255, 0.05)",
										border: "1px solid var(--border)",
										borderRadius: "8px",
										color: "var(--text)",
										fontSize: "1rem"
									}}
								/>
							</div>

							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										color: "var(--text)",
										fontWeight: "600"
									}}>
									Nombre de Carpeta *
								</label>
								<input
									type="text"
									value={currentSubpack.folder_name}
									onChange={(e) =>
										setCurrentSubpack((prev) => ({
											...prev,
											folder_name: e.target.value
										}))
									}
									placeholder="subpacks/mi_subpack"
									style={{
										width: "100%",
										padding: "0.75rem",
										background: "rgba(255, 255, 255, 0.05)",
										border: "1px solid var(--border)",
										borderRadius: "8px",
										color: "var(--text)",
										fontSize: "1rem"
									}}
								/>
								<small
									style={{
										color: "var(--muted)",
										marginTop: "0.25rem",
										display: "block"
									}}>
									Ruta relativa a la carpeta del subpack
								</small>
							</div>

							<div>
								<label
									style={{
										display: "block",
										marginBottom: "0.5rem",
										color: "var(--text)",
										fontWeight: "600"
									}}>
									Memory Tier (opcional)
								</label>
								<input
									type="number"
									value={currentSubpack.memory_tier}
									onChange={(e) =>
										setCurrentSubpack((prev) => ({
											...prev,
											memory_tier:
												parseInt(e.target.value) || 0
										}))
									}
									min="0"
									max="3"
									style={{
										width: "100%",
										padding: "0.75rem",
										background: "rgba(255, 255, 255, 0.05)",
										border: "1px solid var(--border)",
										borderRadius: "8px",
										color: "var(--text)",
										fontSize: "1rem"
									}}
								/>
								<small
									style={{
										color: "var(--muted)",
										marginTop: "0.25rem",
										display: "block"
									}}>
									0 = bajo, 1 = medio, 2 = alto, 3 = muy alto
								</small>
							</div>

							<button
								className="btn btn-primary"
								onClick={addSubpack}
								disabled={
									!currentSubpack.name ||
									!currentSubpack.folder_name
								}
								style={{ width: "100%" }}>
								➕ Agregar Subpack
							</button>
						</div>
					</div>

					{/* Capabilities & Metadata */}
					<div
						style={{
							display: "grid",
							gap: "2rem",
							gridTemplateColumns:
								"repeat(auto-fit, minmax(300px, 1fr))"
						}}>
						{/* Capabilities */}
						<div className="card glass">
							<h2
								style={{
									color: "var(--primary)",
									marginBottom: "1.5rem",
									display: "flex",
									alignItems: "center",
									gap: "0.5rem"
								}}>
								⚡ Capacidades
							</h2>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "0.75rem"
								}}>
								<label
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.75rem",
										cursor: "pointer",
										padding: "0.75rem",
										background:
											manifest.capabilities.includes(
												"experimental_custom_ui"
											)
												? "rgba(8, 255, 200, 0.1)"
												: "transparent",
										borderRadius: "8px",
										border: "1px solid var(--border)"
									}}>
									<input
										type="checkbox"
										checked={manifest.capabilities.includes(
											"experimental_custom_ui"
										)}
										onChange={() =>
											toggleCapability(
												"experimental_custom_ui"
											)
										}
										style={{
											width: "20px",
											height: "20px",
											cursor: "pointer"
										}}
									/>
									<span style={{ color: "var(--text)" }}>
										Experimental Custom UI
									</span>
								</label>
								<label
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.75rem",
										cursor: "pointer",
										padding: "0.75rem",
										background:
											manifest.capabilities.includes(
												"chemistry"
											)
												? "rgba(8, 255, 200, 0.1)"
												: "transparent",
										borderRadius: "8px",
										border: "1px solid var(--border)"
									}}>
									<input
										type="checkbox"
										checked={manifest.capabilities.includes(
											"chemistry"
										)}
										onChange={() =>
											toggleCapability("chemistry")
										}
										style={{
											width: "20px",
											height: "20px",
											cursor: "pointer"
										}}
									/>
									<span style={{ color: "var(--text)" }}>
										Chemistry
									</span>
								</label>
							</div>
						</div>

						{/* Metadata */}
						<div className="card glass">
							<h2
								style={{
									color: "var(--primary)",
									marginBottom: "1.5rem",
									display: "flex",
									alignItems: "center",
									gap: "0.5rem"
								}}>
								📝 Metadata (opcional)
							</h2>
							<div style={{ display: "grid", gap: "1rem" }}>
								<div>
									<label
										style={{
											display: "block",
											marginBottom: "0.5rem",
											color: "var(--text)",
											fontWeight: "600"
										}}>
										Autores
									</label>
									{manifest.metadata.authors.length > 0 && (
										<div
											style={{
												display: "flex",
												flexWrap: "wrap",
												gap: "0.5rem",
												marginBottom: "0.5rem"
											}}>
											{manifest.metadata.authors.map(
												(author, idx) => (
													<span
														key={idx}
														style={{
															padding:
																"0.25rem 0.75rem",
															background:
																"rgba(8, 255, 200, 0.1)",
															color: "var(--primary)",
															borderRadius:
																"999px",
															fontSize: "0.85rem",
															display: "flex",
															alignItems:
																"center",
															gap: "0.5rem"
														}}>
														{author}
														<button
															onClick={() =>
																removeAuthor(
																	idx
																)
															}
															style={{
																background:
																	"transparent",
																border: "none",
																color: "var(--primary)",
																cursor: "pointer",
																padding: "0"
															}}>
															✕
														</button>
													</span>
												)
											)}
										</div>
									)}
									<div
										style={{
											display: "flex",
											gap: "0.5rem"
										}}>
										<input
											type="text"
											value={authorInput}
											onChange={(e) =>
												setAuthorInput(e.target.value)
											}
											onKeyPress={(e) =>
												e.key === "Enter" && addAuthor()
											}
											placeholder="Nombre del autor"
											style={{
												flex: 1,
												padding: "0.5rem",
												background:
													"rgba(255, 255, 255, 0.05)",
												border: "1px solid var(--border)",
												borderRadius: "6px",
												color: "var(--text)",
												fontSize: "0.9rem"
											}}
										/>
										<button
											className="btn btn-ghost"
											onClick={addAuthor}
											disabled={!authorInput.trim()}>
											➕
										</button>
									</div>
								</div>

								<div>
									<label
										style={{
											display: "block",
											marginBottom: "0.5rem",
											color: "var(--text)",
											fontWeight: "600"
										}}>
										Licencia
									</label>
									<input
										type="text"
										value={manifest.metadata.license}
										onChange={(e) =>
											setManifest((prev) => ({
												...prev,
												metadata: {
													...prev.metadata,
													license: e.target.value
												}
											}))
										}
										placeholder="MIT, GPL, etc."
										style={{
											width: "100%",
											padding: "0.5rem",
											background:
												"rgba(255, 255, 255, 0.05)",
											border: "1px solid var(--border)",
											borderRadius: "6px",
											color: "var(--text)",
											fontSize: "0.9rem"
										}}
									/>
								</div>

								<div>
									<label
										style={{
											display: "block",
											marginBottom: "0.5rem",
											color: "var(--text)",
											fontWeight: "600"
										}}>
										URL
									</label>
									<input
										type="url"
										value={manifest.metadata.url}
										onChange={(e) =>
											setManifest((prev) => ({
												...prev,
												metadata: {
													...prev.metadata,
													url: e.target.value
												}
											}))
										}
										placeholder="https://tu-sitio.com"
										style={{
											width: "100%",
											padding: "0.5rem",
											background:
												"rgba(255, 255, 255, 0.05)",
											border: "1px solid var(--border)",
											borderRadius: "6px",
											color: "var(--text)",
											fontSize: "0.9rem"
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="card glass">
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "1rem"
						}}>
						<h2 style={{ color: "var(--primary)", margin: 0 }}>
							Preview JSON
						</h2>
						<button
							className="btn btn-ghost"
							onClick={() => {
								const cleanManifest = {
									format_version: manifest.format_version,
									// METADATA VA PRIMERO
									...((manifest.metadata.authors.length > 0 ||
										manifest.metadata.license ||
										manifest.metadata.url) && {
										metadata: {
											...(manifest.metadata.authors
												.length > 0 && {
												authors:
													manifest.metadata.authors
											}),
											...(manifest.metadata.license && {
												license:
													manifest.metadata.license
											}),
											...(manifest.metadata.url && {
												url: manifest.metadata.url
											}),
											// Agregar generated_with si quieres
											generated_with: {
												tool: "Manifest Generator",
												version: "1.0.0"
											}
										}
									}),
									header: manifest.header,
									modules: manifest.modules,
									...(manifest.dependencies.length > 0 && {
										dependencies: manifest.dependencies
									}),
									...(manifest.capabilities.length > 0 && {
										capabilities: manifest.capabilities
									}),
									...(manifest.subpacks.length > 0 && {
										subpacks: manifest.subpacks
									})
								};
								navigator.clipboard.writeText(
									JSON.stringify(cleanManifest, null, 2)
								);
								alert("✅ Manifest copiado al portapapeles");
							}}
							style={{ whiteSpace: "nowrap" }}>
							📋 Copiar
						</button>
					</div>
					<pre
						style={{
							background: "#0d1117",
							padding: "1.5rem",
							borderRadius: "8px",
							overflow: "auto",
							maxHeight: "600px",
							border: "1px solid var(--border)",
							color: "#08ffc8",
							fontSize: "0.9rem",
							lineHeight: "1.5",
							fontFamily: "monospace"
						}}>
						{JSON.stringify(
							{
								format_version: manifest.format_version,
								header: manifest.header,
								modules: manifest.modules,
								...(manifest.dependencies.length > 0 && {
									dependencies: manifest.dependencies
								}),
								...(manifest.capabilities.length > 0 && {
									capabilities: manifest.capabilities
								}),
								...(manifest.subpacks.length > 0 && {
									subpacks: manifest.subpacks
								}),
								...((manifest.metadata.authors.length > 0 ||
									manifest.metadata.license ||
									manifest.metadata.url) && {
									metadata: {
										...(manifest.metadata.authors.length >
											0 && {
											authors: manifest.metadata.authors
										}),
										...(manifest.metadata.license && {
											license: manifest.metadata.license
										}),
										...(manifest.metadata.url && {
											url: manifest.metadata.url
										})
									}
								})
							},
							null,
							2
						)}
					</pre>
				</div>
			)}

			<div
				className="card glass"
				style={{
					marginTop: "2rem",
					background: "rgba(8, 255, 200, 0.05)",
					border: "1px solid var(--primary)"
				}}>
				<h3
					style={{
						color: "var(--primary)",
						marginBottom: "1rem",
						display: "flex",
						alignItems: "center",
						gap: "0.5rem"
					}}>
					💡 Tips Importantes
				</h3>
				<ul
					style={{
						color: "var(--muted)",
						lineHeight: "1.8",
						paddingLeft: "1.5rem"
					}}>
					<li>Los UUIDs deben ser únicos para cada pack y módulo</li>
					<li>
						Un Behavior Pack debe usar módulo tipo{" "}
						<code
							style={{
								background: "rgba(255,255,255,0.1)",
								padding: "2px 6px",
								borderRadius: "4px",
								color: "var(--primary)"
							}}>
							data
						</code>{" "}
						o{" "}
						<code
							style={{
								background: "rgba(255,255,255,0.1)",
								padding: "2px 6px",
								borderRadius: "4px",
								color: "var(--primary)"
							}}>
							script
						</code>{" "}
						para scripts
					</li>
					<li>
						Un Resource Pack debe usar módulo tipo{" "}
						<code
							style={{
								background: "rgba(255,255,255,0.1)",
								padding: "2px 6px",
								borderRadius: "4px",
								color: "var(--primary)"
							}}>
							resources
						</code>
					</li>
					<li>
						Los script modules requieren un entry point (ej:
						scripts/main.js)
					</li>
					<li>
						Para usar @minecraft/server, agrégalo como dependencia
						de módulo
					</li>
					<li>
						Las versiones siguen el formato semántico: [major,
						minor, patch]
					</li>
					<li>
						Usa la versión mínima de Minecraft más reciente posible
						para aprovechar nuevas features
					</li>
					<li>El manifest.json debe ir en la raíz de tu pack</li>
					<li>
						Los subpacks permiten organizar contenido en carpetas
						separadas
					</li>
					<li>
						Memory tier en subpacks: 0=bajo, 1=medio, 2=alto, 3=muy
						alto
					</li>
				</ul>
			</div>

			{(!manifest.header.name ||
				!manifest.header.uuid ||
				manifest.modules.length === 0) && (
				<div
					style={{
						marginTop: "2rem",
						padding: "1rem",
						background: "rgba(255, 94, 98, 0.1)",
						border: "1px solid #ff5e62",
						borderRadius: "8px",
						color: "#ff5e62",
						textAlign: "center"
					}}>
					⚠️ Completa los campos obligatorios: Nombre, UUID del pack y
					al menos un módulo
				</div>
			)}
		</div>
	);
}
