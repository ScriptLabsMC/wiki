// sync.cjs
const chokidar = require("chokidar");
const { exec } = require("child_process");
const path = require("path");

// Colores para consola
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
};

// Configuración
const CONFIG = {
    // Rutas - ajusta según tu configuración
    source: "/storage/emulated/0/www/wiki-nxt/",
    destination: "/data/data/com.termux/files/home/wiki-nxt/",

    // Exclusiones
    exclude: ["node_modules", ".next", ".DS_Store", "*.tmp"],

    // Tiempo de espera para sync (ms)
    debounceTime: 1500,

    // Comando rsync
    rsyncFlags: "-av --delete"
};

let timeout;
let isSyncing = false;
let pendingChanges = [];

// Función para imprimir con formato
function log(message, color = colors.white, type = "info") {
    const timestamp = new Date().toLocaleTimeString();
    const prefixes = {
        info: `${colors.cyan}ℹ️ ${colors.reset}`,
        success: `${colors.green}✅${colors.reset}`,
        warning: `${colors.yellow}⚠️ ${colors.reset}`,
        error: `${colors.red}❌${colors.reset}`,
        file: `${colors.blue}📁${colors.reset}`,
        sync: `${colors.magenta}🔄${colors.reset}`,
        config: `${colors.cyan}⚙️ ${colors.reset}`
    };

    console.log(
        `${colors.dim}[${timestamp}]${colors.reset} ${prefixes[type]} ${color}${message}${colors.reset}`
    );
}

// Línea separadora
function separator() {
    console.log(`${colors.dim}${"─".repeat(50)}${colors.reset}`);
}

// Banner de inicio
console.log(
    `\n${colors.bright}${colors.cyan}┌────────────────────────────────────────────────┐`
);
console.log(`${colors.cyan}│               🚀 SYNC WATCHER TERMUX           │`);
console.log(
    `${colors.cyan}└────────────────────────────────────────────────┘${colors.reset}\n`
);

log("Iniciando monitor de sincronización automática...", colors.cyan, "info");
separator();

const watcher = chokidar.watch("/storage/emulated/0/www/wiki-nxt/", {
    ignored: filePath => {
        const basename = path.basename(filePath);
        return CONFIG.exclude.some(pattern => {
            if (pattern.includes("*")) {
                const regex = new RegExp(pattern.replace("*", ".*"));
                return regex.test(basename);
            }
            return basename === pattern || filePath.includes(pattern);
        });
    },
    persistent: true,
    ignoreInitial: true,
    depth: 10
});

function ejecutarComando(archivo) {
    const relativePath = path.relative(CONFIG.source, archivo);
    log(`Archivo modificado: ${relativePath}`, colors.yellow, "file");
    log(
        `Sincronización programada en ${CONFIG.debounceTime}ms`,
        colors.dim,
        "info"
    );

    // Registrar cambio pendiente
    if (!pendingChanges.includes(archivo)) {
        pendingChanges.push(archivo);
    }

    // Clear previous timeout
    clearTimeout(timeout);

    // Wait after the last change
    timeout = setTimeout(() => {
        iniciarSync();
    }, CONFIG.debounceTime);
}

function iniciarSync() {
    if (isSyncing) {
        log(
            "Sincronización en progreso, reagendando...",
            colors.yellow,
            "warning"
        );
        timeout = setTimeout(iniciarSync, 2000);
        return;
    }

    isSyncing = true;
    const cambios = [...pendingChanges];
    pendingChanges = [];

    separator();
    log("Iniciando proceso de sincronización...", colors.magenta, "sync");

    if (cambios.length > 0) {
        log(`Archivos detectados:`, colors.blue, "file");
        cambios.slice(0, 3).forEach(archivo => {
            const relativePath = path.relative(CONFIG.source, archivo);
            log(`  📄 ${relativePath}`, colors.dim);
        });
        if (cambios.length > 3) {
            log(`  ... y ${cambios.length - 3} archivos más`, colors.dim);
        }
    }

    // Construir comando rsync
    const excludeArgs = CONFIG.exclude
        .map(pattern => `--exclude="${pattern}"`)
        .join(" ");
    const comando = `rsync ${CONFIG.rsyncFlags} ${excludeArgs} "${CONFIG.source}" "${CONFIG.destination}"`;

    const startTime = Date.now();
    const syncProcess = exec(comando, (error, stdout, stderr) => {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        isSyncing = false;

        if (error) {
            separator();
            log(
                `Error en sincronización: ${error.message}`,
                colors.red,
                "error"
            );
            if (stderr) {
                log("Detalles del error:", colors.red, "error");
                console.log(`${colors.red}${stderr}${colors.reset}`);
            }
            separator();
            return;
        }

        separator();
        log(
            `Sincronización completada en ${duration.toFixed(2)} segundos`,
            colors.green,
            "success"
        );

        if (stdout.trim()) {
            const lines = stdout.split("\n").filter(line => line.trim());
            if (lines.length > 0) {
                log(
                    `Archivos procesados: ${lines.length} cambios`,
                    colors.blue,
                    "file"
                );

                // Mostrar resumen de archivos sincronizados
                const fileChanges = lines.filter(
                    line =>
                        !line.endsWith("/") &&
                        !line.includes("sending incremental file list")
                );
                if (fileChanges.length > 0) {
                    log("Últimos archivos sincronizados:", colors.dim);
                    fileChanges.slice(-3).forEach(line => {
                        log(`  📄 ${line}`, colors.dim);
                    });
                    if (fileChanges.length > 3) {
                        log(
                            `  ... y ${fileChanges.length - 3} más`,
                            colors.dim
                        );
                    }
                }
            }
        }

        // Si hay cambios pendientes durante el sync, ejecutar otro
        if (pendingChanges.length > 0) {
            log(
                `Cambios pendientes detectados: ${pendingChanges.length} archivos`,
                colors.yellow,
                "warning"
            );
            log("Reiniciando sincronización...", colors.magenta, "sync");
            separator();
            setTimeout(iniciarSync, 1000);
        } else {
            log("Esperando nuevos cambios...", colors.cyan, "info");
            separator();
        }
    });

    // Manejar cierre del proceso
    process.on("SIGINT", () => {
        log(
            "Deteniendo proceso de sincronización...",
            colors.yellow,
            "warning"
        );
        syncProcess.kill();
        watcher.close().then(() => {
            log("Watcher detenido correctamente", colors.green, "success");
            process.exit(0);
        });
    });
}

// Eventos del watcher
watcher
    .on("ready", () => {
        separator();
        log(
            "Watcher inicializado y monitoreando activamente",
            colors.green,
            "success"
        );
        log("Configuración actual:", colors.cyan, "config");
        log(`  📂 Origen: ${CONFIG.source}`, colors.dim);
        log(`  📂 Destino: ${CONFIG.destination}`, colors.dim);
        log(`  🚫 Exclusiones: ${CONFIG.exclude.join(", ")}`, colors.dim);
        log(`  ⏰ Tiempo de espera: ${CONFIG.debounceTime}ms`, colors.dim);
        log(`  🔧 Flags rsync: ${CONFIG.rsyncFlags}`, colors.dim);
        separator();
        log("Listo para detectar cambios...", colors.green, "success");
        separator();
    })
    .on("change", ejecutarComando)
    .on("add", ejecutarComando)
    .on("unlink", ejecutarComando)
    .on("unlinkDir", ejecutarComando)
    .on("error", error => {
        log(`Error del watcher: ${error}`, colors.red, "error");
    });

// Manejo graceful de cierre
process.on("SIGINT", () => {
    separator();
    log("Señal de interrupción recibida (Ctrl+C)", colors.yellow, "warning");
    log("Deteniendo watcher de manera segura...", colors.yellow, "warning");
    clearTimeout(timeout);
    watcher.close().then(() => {
        separator();
        log(
            "Sincronizador detenido correctamente. ¡Hasta pronto! 👋",
            colors.green,
            "success"
        );
        separator();
        process.exit(0);
    });
});

process.on("SIGTERM", () => {
    log("Señal de terminación recibida", colors.yellow, "warning");
    clearTimeout(timeout);
    watcher.close().then(() => {
        process.exit(0);
    });
});

// Validar directorios
log("Validando acceso a directorios...", colors.cyan, "info");

exec(`ls -la "${CONFIG.source}"`, error => {
    if (error) {
        log(
            `No se puede acceder al directorio origen: ${CONFIG.source}`,
            colors.red,
            "error"
        );
    } else {
        log(
            `Directorio origen accesible: ${CONFIG.source}`,
            colors.green,
            "success"
        );
    }
});

exec(`ls -la "${CONFIG.destination}"`, error => {
    if (error) {
        log(
            `No se puede acceder al directorio destino: ${CONFIG.destination}`,
            colors.red,
            "error"
        );
    } else {
        log(
            `Directorio destino accesible: ${CONFIG.destination}`,
            colors.green,
            "success"
        );
    }
});

log("Inicialización completada", colors.green, "success");
log("Presiona Ctrl+C para detener el monitor", colors.yellow, "warning");
separator();
