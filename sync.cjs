// sync.cjs
const chokidar = require("chokidar");
const {
  exec,
  spawn
} = require("child_process");
const path = require("path");
const fs = require("fs");

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
  exclude: ["node_modules",
    ".next",
    ".DS_Store",
    "*.tmp",
    "*.log",
    ".git"],

  // Tiempo de espera para sync (ms)
  debounceTime: 2000,

  // Comando rsync
  rsyncFlags: "-av --delete",

  // Intentos de reconexión
  maxRetries: 5,
  retryDelay: 5000,

  // Health check interval
  healthCheckInterval: 30000
};

// Variables globales
let timeout;
let isSyncing = false;
let pendingChanges = new Set();
let watcher;
let retryCount = 0;
let healthCheckInterval;
let isWatcherReady = false;

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
    config: `${colors.cyan}⚙️ ${colors.reset}`,
    retry: `${colors.yellow}🔄${colors.reset}`,
    health: `${colors.green}❤️ ${colors.reset}`
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
function showBanner() {
  console.log(
    `\n${colors.bright}${colors.cyan}┌──────────────────────────────────────────────┐`
  );
  console.log(`${colors.cyan}│           🚀 SYNC WATCHER TERMUX PRO         │`);
  console.log(
    `${colors.cyan}└──────────────────────────────────────────────┘${colors.reset}\n`
  );
}

// Validar y crear directorios si no existen
function validateAndCreateDirs() {
  return new Promise((resolve, reject) => {
    const dirs = [CONFIG.source, CONFIG.destination];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        log(`Creando directorio: ${dir}`, colors.yellow, "warning");
        try {
          fs.mkdirSync(dir, {
            recursive: true
          });
          log(`Directorio creado: ${dir}`, colors.green, "success");
        } catch (err) {
          log(`Error creando directorio ${dir}: ${err.message}`, colors.red, "error");
        }
      }
    });
    resolve();
  });
}

// Health check del watcher
function startHealthCheck() {
  healthCheckInterval = setInterval(() => {
    if (!isWatcherReady) {
      log("Watcher no está listo - verificando...", colors.yellow, "health");
      return;
    }

    // Verificar si el watcher todavía está activo
    if (!watcher) {
      log("Watcher perdido - reiniciando...", colors.red, "health");
      restartWatcher();
      return;
    }

    log("Health check: Watcher activo ✓", colors.green, "health");

    // Verificar acceso a directorios
    checkDirectoryAccess();
  },
    CONFIG.healthCheckInterval);
}

// Verificar acceso a directorios
function checkDirectoryAccess() {
  [CONFIG.source, CONFIG.destination].forEach(dir => {
    fs.access(dir, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (err) {
        log(`Sin acceso a: ${dir}`, colors.red, "error");
      }
    });
  });
}

// Inicializar watcher con manejo de reintentos
function initializeWatcher() {
  log("Inicializando watcher...", colors.cyan, "info");

  try {
    watcher = chokidar.watch(CONFIG.source, {
      ignored: (filePath) => {
        if (!filePath) return false;

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
      depth: 8,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100
      },
      interval: 1000,
      binaryInterval: 1000
    });

    // Configurar eventos
    setupWatcherEvents(watcher);

    retryCount = 0; // Resetear contador de reintentos
    return watcher;

  } catch (error) {
    log(`Error crítico al crear watcher: ${error.message}`, colors.red, "error");
    handleWatcherError(error);
    return null;
  }
}

// Configurar eventos del watcher
function setupWatcherEvents(watcherInstance) {
  watcherInstance
  .on("ready", () => {
    isWatcherReady = true;
    separator();
    log("Watcher inicializado y monitoreando activamente",
      colors.green,
      "success");
    log("Configuración actual:",
      colors.cyan,
      "config");
    log(`  📂 Origen: ${CONFIG.source}`,
      colors.dim);
    log(`  📂 Destino: ${CONFIG.destination}`,
      colors.dim);
    log(`  🚫 Exclusiones: ${CONFIG.exclude.join(", ")}`,
      colors.dim);
    log(`  ⏰ Debounce: ${CONFIG.debounceTime}ms`,
      colors.dim);
    log(`  🔧 Flags: ${CONFIG.rsyncFlags}`,
      colors.dim);
    separator();
    log("Listo para detectar cambios...",
      colors.green,
      "success");
  })
  .on("add", (path) => handleFileEvent("añadido",
    path))
  .on("change", (path) => handleFileEvent("modificado",
    path))
  .on("unlink", (path) => handleFileEvent("eliminado",
    path))
  .on("unlinkDir", (path) => handleFileEvent("directorio eliminado",
    path))
  .on("addDir", (path) => handleFileEvent("directorio añadido",
    path))
  .on("error", (error) => {
    log(`Error del watcher: ${error.message}`,
      colors.red,
      "error");
    handleWatcherError(error);
  })
  .on("raw", (event,
    path,
    details) => {
    // Debug de eventos del sistema de archivos
    if (event === "rename") {
      log(`Evento raw: ${event} - ${path}`, colors.dim);
    }
  });
}

// Manejar eventos de archivos
function handleFileEvent(eventType, filePath) {
  if (!filePath) return;

  const relativePath = path.relative(CONFIG.source, filePath);
  log(`Archivo ${eventType}: ${relativePath}`, colors.yellow, "file");

  // Agregar a cambios pendientes
  pendingChanges.add(filePath);

  // Programar sincronización
  scheduleSync();
}

// Programar sincronización con debounce
function scheduleSync() {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    if (pendingChanges.size > 0) {
      iniciarSync();
    }
  },
    CONFIG.debounceTime);

  log(`Sync programado en ${CONFIG.debounceTime}ms (${pendingChanges.size} cambios)`,
    colors.dim,
    "info");
}

// Función principal de sincronización
function iniciarSync() {
  if (isSyncing) {
    log("Sincronización en progreso, reagendando...", colors.yellow, "warning");
    timeout = setTimeout(iniciarSync, 3000);
    return;
  }

  if (pendingChanges.size === 0) {
    return;
  }

  isSyncing = true;
  const cambios = Array.from(pendingChanges);
  pendingChanges.clear();

  separator();
  log(`Iniciando sync con ${cambios.length} archivos...`, colors.magenta, "sync");

  // Mostrar resumen de cambios
  if (cambios.length > 0) {
    log("Archivos a sincronizar:", colors.blue, "file");
    cambios.slice(0, 4).forEach(archivo => {
      const relativePath = path.relative(CONFIG.source, archivo);
      log(`  📄 ${relativePath}`, colors.dim);
    });
    if (cambios.length > 4) {
      log(`  ... y ${cambios.length - 4} más`, colors.dim);
    }
  }

  // Construir y ejecutar comando rsync
  executeRsync(cambios);
}

// Ejecutar rsync
function executeRsync(cambios) {
  const excludeArgs = CONFIG.exclude
  .map(pattern => `--exclude="${pattern}"`)
  .join(" ");

  const comando = `rsync ${CONFIG.rsyncFlags} ${excludeArgs} "${CONFIG.source}" "${CONFIG.destination}"`;

  const startTime = Date.now();

  log(`Ejecutando: rsync...`, colors.dim, "info");

  const syncProcess = spawn('rsync', [
    ...CONFIG.rsyncFlags.split(' '),
    ...CONFIG.exclude.map(pattern => `--exclude=${pattern}`),
    CONFIG.source,
    CONFIG.destination
  ], {
    shell: true
  });

  let stdout = '';
  let stderr = '';

  syncProcess.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  syncProcess.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  syncProcess.on('close', (code) => {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    isSyncing = false;

    if (code === 0) {
      handleSyncSuccess(stdout, duration, cambios);
    } else {
      handleSyncError(stderr, code, cambios);
    }
  });

  syncProcess.on('error',
    (error) => {
      isSyncing = false;
      log(`Error ejecutando rsync: ${error.message}`, colors.red, "error");
      handlePendingChanges(cambios);
    });
}

// Manejar éxito de sincronización
function handleSyncSuccess(stdout, duration, cambios) {
  separator();
  log(`Sync completado en ${duration.toFixed(2)}s`,
    colors.green,
    "success");

  if (stdout.trim()) {
    const lines = stdout.split('\n').filter(line => line.trim());
    const fileChanges = lines.filter(line =>
      !line.endsWith('/') &&
      !line.includes('sending incremental file list') &&
      line.trim()
    );

    if (fileChanges.length > 0) {
      log(`Procesados: ${fileChanges.length} archivos`, colors.blue, "file");
      fileChanges.slice(-3).forEach(line => {
        if (line.trim()) log(`  ✓ ${line.trim()}`, colors.dim);
      });
    }
  }

  // Verificar si hay cambios pendientes durante el sync
  checkPendingChangesAfterSync();
}

// Manejar error de sincronización
function handleSyncError(stderr, code, cambios) {
  separator();
  log(`Error en sync (código ${code})`,
    colors.red,
    "error");

  if (stderr) {
    log("Detalles del error:", colors.red, "error");
    const errorLines = stderr.split('\n').filter(line => line.trim());
    errorLines.slice(0, 3).forEach(line => {
      log(`  ${line}`, colors.red);
    });
  }

  // Reagendar cambios fallidos
  handlePendingChanges(cambios);
}

// Manejar cambios pendientes después de error
function handlePendingChanges(cambios) {
  if (cambios.length > 0) {
    log(`Reagendando ${cambios.length} archivos fallidos...`, colors.yellow, "warning");
    cambios.forEach(archivo => pendingChanges.add(archivo));
    scheduleSync();
  }
}

// Verificar cambios pendientes después del sync
function checkPendingChangesAfterSync() {
  if (pendingChanges.size > 0) {
    log(`${pendingChanges.size} cambios pendientes detectados`, colors.yellow, "warning");
    log("Ejecutando sync adicional...", colors.magenta, "sync");
    separator();
    setTimeout(iniciarSync, 1000);
  } else {
    log("Esperando nuevos cambios...", colors.cyan, "info");
    separator();
  }
}

// Manejar errores del watcher
function handleWatcherError(error) {
  isWatcherReady = false;

  if (retryCount < CONFIG.maxRetries) {
    retryCount++;
    log(`Reintentando watcher en ${CONFIG.retryDelay/1000}s... (${retryCount}/${CONFIG.maxRetries})`, colors.yellow, "retry");

    setTimeout(() => {
      restartWatcher();
    }, CONFIG.retryDelay);
  } else {
    log("Máximo de reintentos alcanzado. Deteniendo...", colors.red, "error");
    gracefulShutdown();
  }
}

// Reiniciar watcher
function restartWatcher() {
  log("Reiniciando watcher...", colors.yellow, "retry");

  if (watcher) {
    watcher.close().catch(() => {});
  }

  clearTimeout(timeout);
  pendingChanges.clear();
  isSyncing = false;

  setTimeout(() => {
    watcher = initializeWatcher();
  }, 1000);
}

// Cierre graceful
function gracefulShutdown() {
  log("Iniciando cierre graceful...", colors.yellow, "warning");

  clearTimeout(timeout);
  clearInterval(healthCheckInterval);

  if (watcher) {
    watcher.close().then(() => {
      log("Watcher cerrado correctamente", colors.green, "success");
      process.exit(0);
    }).catch(() => {
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Manejo de señales del sistema
function setupSignalHandlers() {
  process.on("SIGINT", () => {
    separator();
    log("SIGINT recibido (Ctrl+C)", colors.yellow, "warning");
    gracefulShutdown();
  });

  process.on("SIGTERM", () => {
    log("SIGTERM recibido", colors.yellow, "warning");
    gracefulShutdown();
  });

  process.on("uncaughtException", (error) => {
    log(`Excepción no capturada: ${error.message}`, colors.red, "error");
    console.error(error.stack);
    restartWatcher();
  });

  process.on("unhandledRejection", (reason, promise) => {
    log(`Promesa rechazada no manejada: ${reason}`, colors.red, "error");
    restartWatcher();
  });
}

// Función principal de inicialización
async function main() {
  showBanner();

  log("Iniciando Sync Watcher Pro...", colors.cyan, "info");
  separator();

  // Validar y crear directorios
  await validateAndCreateDirs();

  // Configurar manejadores de señales
  setupSignalHandlers();

  // Iniciar health checks
  startHealthCheck();

  // Inicializar watcher
  watcher = initializeWatcher();

  // Verificación inicial de directorios
  checkDirectoryAccess();

  log("Inicialización completada ✓", colors.green, "success");
  log("Presiona Ctrl+C para detener", colors.yellow, "warning");
  separator();
}

// Iniciar aplicación
main().catch(error => {
  log(`Error en inicialización: ${error.message}`, colors.red, "error");
  process.exit(1);
});