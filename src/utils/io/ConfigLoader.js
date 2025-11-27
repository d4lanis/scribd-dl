import fs from 'fs'
import ini from 'ini'

const source = "config.ini"
const content = fs.readFileSync(source, { encoding: "utf-8" })
const config = ini.parse(content)

class ConfigLoader {
    constructor() {
        if (!ConfigLoader.instance) {
            ConfigLoader.instance = this
            this.overrides = {}
        }
        return ConfigLoader.instance
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
     * @returns {Promise<string>}
     */
    load(section, key) {
        if (this.overrides[section] && this.overrides[section][key] !== undefined) {
            return this.overrides[section][key]
        }
        if (Object.keys(config[section]).includes(key)) {
            return config[section][key]
        } else {
            throw new TypeError(`Unknown key: ${key}`)
        }
    }
}

export const configLoader = new ConfigLoader()
