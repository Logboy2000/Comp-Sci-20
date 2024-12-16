class Setting {
    constructor(value, name, defaultValue = null) {
        this.value = value !== undefined ? value : defaultValue;
        this.name = name;
    }
}

class BooleanSetting extends Setting {
    constructor(value, name, defaultValue = false) {
        super(Boolean(value), name, defaultValue);
    }
}

class NumberSetting extends Setting {
    constructor(value, name, defaultValue = 0) {
        super(Number(value), name, defaultValue);
    }
}

class StringSetting extends Setting {
    constructor(value, name, defaultValue = '') {
        super(String(value), name, defaultValue);
    }
}

class EnumSetting extends Setting {
    constructor(value, validValues, name, defaultValue = null) {
        if (!validValues.includes(value)) {
            throw new Error(`Invalid value for enum setting: ${value}`);
        }
        super(value, name, defaultValue);
    }
}

class SettingsManager {
    constructor() {
        this.settings = {};
    }

    getSetting(key) {
        return this.settings[key];
    }

    setSetting(key, value) {
        this.settings[key] = value;
    }

    addSetting(setting) {
        this.setSetting(setting.name, setting.value);
    }
}

const settingsManager = new SettingsManager();

function loaded() {
    settingsManager.addSetting(new BooleanSetting('darkMode', 'Dark Mode'));
}
