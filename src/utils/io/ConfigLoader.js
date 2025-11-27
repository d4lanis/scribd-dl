import fs from 'fs'
import ini from 'ini'
import path from 'path'

class ConfigLoader {
    constructor() {
        if (!ConfigLoader.instance) {
            ConfigLoader.instance = this
            this.overrides = {}
            this.config = {}
            this.init()
        }
        return ConfigLoader.instance
    }

    init() {
        const source = "config.ini"
        // Check if file exists before reading
        if (fs.existsSync(source)) {
            try {
                const content = fs.readFileSync(source, { encoding: "utf-8" })
                this.config = ini.parse(content)
            } catch (e) {
                console.warn(`Failed to load ${source}: ${e.message}`)
            }
        } else {
            // Try to find in root if we are in src/function (Appwrite structure)
            // But for now, just warn and use empty config
            console.warn(`${source} not found. Using defaults/overrides.`)
        }
    }

    /**
     * Set override value
     * @param {string} section 
     * @param {string} key 
     * @param {string} value 
     */
    set(section, key, value) {
        if (!this.overrides[section]) {
            this.overrides[section] = {}
        }
        this.overrides[section][key] = value
    }

    /**
     * Get the value in config.ini or overrides
     * @param {string} section 
     * @param {string} key 
     * @returns {string}
     */
    load(section, key) {
        if (this.overrides[section] && this.overrides[section][key] !== undefined) {
            return this.overrides[section][key]
        }
        if (this.config[section] && Object.keys(this.config[section]).includes(key)) {
            return this.config[section][key]
        } else {
            // Return undefined or throw? Original threw TypeError.
            // But for Appwrite, we might rely on env vars or defaults.
            // Let's check environment variables as fallback
            const envKey = `${section}_${key}`.toUpperCase();
            if (process.env[envKey]) {
                return process.env[envKey];
            }

            // Fallback defaults for critical keys to prevent crash
            if (section === 'DIRECTORY' && key === 'output') return '/tmp';
            if (section === 'DIRECTORY' && key === 'filename') return 'title';
            if (section === 'SCRIBD' && key === 'rendertime') return '3000';

            throw new TypeError(`Unknown key: ${key}`)
        }
    }
}

export const configLoader = new ConfigLoader()
