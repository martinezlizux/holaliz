#!/usr/bin/env node

/**
 * Build Script para Portfolio Website
 * Automatiza el proceso de versionado y optimización
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuración del build
const BUILD_CONFIG = {
    version: '1.0.0',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV || 'production',
    
    // Directorios
    sourceDir: './',
    outputDir: './dist',
    assetsDir: './assets',
    
    // Archivos a procesar
    files: {
        css: [
            'assets/css/style.css',
            'assets/css/fontawesome.css'
        ],
        js: [
            'assets/js/script.js',
            'assets/js/contact-form.js',
            'assets/js/analytics.js',
            'assets/js/performance.js',
            'assets/js/version-manager.js'
        ],
        html: [
            'index.html',
            'aboutme.html',
            'resume.html',
            'test-form.html',
            'portfolio/Drivers-App.html',
            'portfolio/rewards-points.html',
            'portfolio/research-travelers.html',
            'portfolio/Design-System.html'
        ]
    }
};

// Utilidades
class BuildUtils {
    // Generar hash MD5 para un archivo
    static generateFileHash(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
        } catch (error) {
            console.error(`Error generando hash para ${filePath}:`, error.message);
            return Date.now().toString(36);
        }
    }
    
    // Crear directorio si no existe
    static ensureDir(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`📁 Directorio creado: ${dirPath}`);
        }
    }
    
    // Copiar archivo con versionado
    static copyFileWithVersioning(sourcePath, destPath, fileHash) {
        try {
            const content = fs.readFileSync(sourcePath, 'utf8');
            const versionedContent = this.addVersionComment(content, fileHash);
            
            // Crear directorio de destino si no existe
            const destDir = path.dirname(destPath);
            this.ensureDir(destDir);
            
            fs.writeFileSync(destPath, versionedContent);
            console.log(`✅ Archivo versionado: ${sourcePath} -> ${destPath}`);
            
            return fileHash;
        } catch (error) {
            console.error(`❌ Error copiando ${sourcePath}:`, error.message);
            return null;
        }
    }
    
    // Agregar comentario de versión
    static addVersionComment(content, fileHash) {
        const versionComment = `/* Version: ${BUILD_CONFIG.version} | Hash: ${fileHash} | Build: ${new Date(BUILD_CONFIG.timestamp).toISOString()} */\n`;
        return versionComment + content;
    }
    
    // Procesar archivo HTML
    static processHTML(htmlPath, versionMap) {
        try {
            let content = fs.readFileSync(htmlPath, 'utf8');
            
            // Reemplazar referencias a archivos CSS y JS con versiones
            Object.keys(versionMap).forEach(filePath => {
                const fileHash = versionMap[filePath];
                const fileName = path.basename(filePath);
                
                // Buscar y reemplazar referencias en HTML
                const regex = new RegExp(`(href|src)=["']([^"']*${fileName.replace('.', '\\.')})["']`, 'g');
                content = content.replace(regex, `$1="$2?v=${fileHash}"`);
            });
            
            // Agregar meta tags de versión
            const versionMeta = `
    <!-- Build Info -->
    <meta name="build-version" content="${BUILD_CONFIG.version}">
    <meta name="build-timestamp" content="${BUILD_CONFIG.timestamp}">
    <meta name="build-environment" content="${BUILD_CONFIG.environment}">
    <!-- End Build Info -->`;
            
            content = content.replace('</head>', `${versionMeta}\n</head>`);
            
            return content;
        } catch (error) {
            console.error(`❌ Error procesando HTML ${htmlPath}:`, error.message);
            return null;
        }
    }
}

// Clase principal del build
class PortfolioBuilder {
    constructor() {
        this.versionMap = {};
        this.buildStats = {
            processed: 0,
            errors: 0,
            startTime: Date.now()
        };
    }
    
    // Inicializar build
    async init() {
        console.log('🚀 Iniciando build del portfolio...');
        console.log(`📦 Versión: ${BUILD_CONFIG.version}`);
        console.log(`🌍 Ambiente: ${BUILD_CONFIG.environment}`);
        console.log(`⏰ Timestamp: ${new Date(BUILD_CONFIG.timestamp).toISOString()}`);
        
        // Crear directorio de salida
        BuildUtils.ensureDir(BUILD_CONFIG.outputDir);
        BuildUtils.ensureDir(path.join(BUILD_CONFIG.outputDir, 'assets'));
        BuildUtils.ensureDir(path.join(BUILD_CONFIG.outputDir, 'portfolio'));
    }
    
    // Procesar archivos CSS
    async processCSS() {
        console.log('\n🎨 Procesando archivos CSS...');
        
        for (const cssFile of BUILD_CONFIG.files.css) {
            try {
                const fileHash = BuildUtils.generateFileHash(cssFile);
                const destPath = path.join(BUILD_CONFIG.outputDir, cssFile);
                
                BuildUtils.copyFileWithVersioning(cssFile, destPath, fileHash);
                this.versionMap[cssFile] = fileHash;
                this.buildStats.processed++;
                
            } catch (error) {
                console.error(`❌ Error procesando CSS ${cssFile}:`, error.message);
                this.buildStats.errors++;
            }
        }
    }
    
    // Procesar archivos JavaScript
    async processJavaScript() {
        console.log('\n⚡ Procesando archivos JavaScript...');
        
        for (const jsFile of BUILD_CONFIG.files.js) {
            try {
                const fileHash = BuildUtils.generateFileHash(jsFile);
                const destPath = path.join(BUILD_CONFIG.outputDir, jsFile);
                
                BuildUtils.copyFileWithVersioning(jsFile, destPath, fileHash);
                this.versionMap[jsFile] = fileHash;
                this.buildStats.processed++;
                
            } catch (error) {
                console.error(`❌ Error procesando JS ${jsFile}:`, error.message);
                this.buildStats.errors++;
            }
        }
    }
    
    // Procesar archivos HTML
    async processHTML() {
        console.log('\n📄 Procesando archivos HTML...');
        
        for (const htmlFile of BUILD_CONFIG.files.html) {
            try {
                const processedContent = BuildUtils.processHTML(htmlFile, this.versionMap);
                
                if (processedContent) {
                    const destPath = path.join(BUILD_CONFIG.outputDir, htmlFile);
                    const destDir = path.dirname(destPath);
                    
                    BuildUtils.ensureDir(destDir);
                    fs.writeFileSync(destPath, processedContent);
                    
                    console.log(`✅ HTML procesado: ${htmlFile} -> ${destPath}`);
                    this.buildStats.processed++;
                }
                
            } catch (error) {
                console.error(`❌ Error procesando HTML ${htmlFile}:`, error.message);
                this.buildStats.errors++;
            }
        }
    }
    
    // Copiar otros assets
    async copyOtherAssets() {
        console.log('\n📁 Copiando otros assets...');
        
        try {
            // Copiar imágenes
            const imagesDir = path.join(BUILD_CONFIG.assetsDir, 'images');
            const destImagesDir = path.join(BUILD_CONFIG.outputDir, BUILD_CONFIG.assetsDir, 'images');
            
            if (fs.existsSync(imagesDir)) {
                BuildUtils.ensureDir(destImagesDir);
                this.copyDirectoryRecursive(imagesDir, destImagesDir);
                console.log('✅ Imágenes copiadas');
            }
            
            // Copiar otros archivos estáticos
            const staticFiles = ['robots.txt', 'sitemap.xml', 'CNAME'];
            staticFiles.forEach(file => {
                if (fs.existsSync(file)) {
                    const destPath = path.join(BUILD_CONFIG.outputDir, file);
                    fs.copyFileSync(file, destPath);
                    console.log(`✅ Archivo copiado: ${file}`);
                }
            });
            
        } catch (error) {
            console.error('❌ Error copiando assets:', error.message);
            this.buildStats.errors++;
        }
    }
    
    // Copiar directorio recursivamente
    copyDirectoryRecursive(source, destination) {
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }
        
        const items = fs.readdirSync(source);
        
        items.forEach(item => {
            const sourcePath = path.join(source, item);
            const destPath = path.join(destination, item);
            
            if (fs.statSync(sourcePath).isDirectory()) {
                this.copyDirectoryRecursive(sourcePath, destPath);
            } else {
                fs.copyFileSync(sourcePath, destPath);
            }
        });
    }
    
    // Generar archivo de manifiesto
    async generateManifest() {
        console.log('\n📋 Generando manifiesto de build...');
        
        const manifest = {
            version: BUILD_CONFIG.version,
            build: {
                timestamp: BUILD_CONFIG.timestamp,
                date: new Date(BUILD_CONFIG.timestamp).toISOString(),
                environment: BUILD_CONFIG.environment
            },
            files: this.versionMap,
            stats: this.buildStats
        };
        
        const manifestPath = path.join(BUILD_CONFIG.outputDir, 'build-manifest.json');
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        
        console.log(`✅ Manifiesto generado: ${manifestPath}`);
    }
    
    // Ejecutar build completo
    async run() {
        try {
            await this.init();
            await this.processCSS();
            await this.processJavaScript();
            await this.processHTML();
            await this.copyOtherAssets();
            await this.generateManifest();
            
            const buildTime = Date.now() - this.buildStats.startTime;
            
            console.log('\n🎉 Build completado exitosamente!');
            console.log(`📊 Estadísticas:`);
            console.log(`   - Archivos procesados: ${this.buildStats.processed}`);
            console.log(`   - Errores: ${this.buildStats.errors}`);
            console.log(`   - Tiempo de build: ${buildTime}ms`);
            console.log(`📁 Output: ${BUILD_CONFIG.outputDir}`);
            
        } catch (error) {
            console.error('❌ Error durante el build:', error.message);
            process.exit(1);
        }
    }
}

// Ejecutar build si se llama directamente
if (require.main === module) {
    const builder = new PortfolioBuilder();
    builder.run();
}

module.exports = PortfolioBuilder;
