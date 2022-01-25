const fs = require('fs');
const YAML = require('yaml');

function fixComments(text) {
    return text.replace(/("|')?~(\d+)?("|')?:\s("|')?.+("|')?/g, match => "# " + match.replace(/("|')?~(\d+)?("|')?:\s/g, '').replace(/("|')/g, ''));
}
module.exports = class Config {
    constructor(path, defaultcontent, options = {}) {
        this.path = path;

        const createConfig = () => {
            fs.writeFileSync(path, fixComments(YAML.stringify(defaultcontent)), (err) => {
                if (err) return err;
            })
        }

        // If the config doesn't exist, create it
        if (!fs.existsSync(path)) {
            // If there isn't an addon_configs folder, create it
            if (!fs.existsSync('./addon_configs')) {
                fs.mkdirSync('./addon_configs', (err) => { if (err) console.log(err); });

                createConfig();
            } else createConfig();
            return YAML.parse(fs.readFileSync(path, 'utf-8'));
        } else {
            // If development mode is set, reset the config
            if (options.development) {
                createConfig();

                return YAML.parse(fs.readFileSync(path, 'utf-8'));
            }
            // If development mode is not set, return the config
            else return YAML.parse(fs.readFileSync(path, 'utf-8'));
        }
    }
}
// %%   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706