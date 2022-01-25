const Utils = require('./utils.js');

module.exports = {
    set: function (variable, value, expireAfter = 0) {
        if (variable == 'set') return Utils.error('Cannot set variable \'set\'');
        this[variable] = value;
        if (expireAfter > 0)
            setTimeout(function () {
                delete this[variable];
            }, expireAfter);
        return value;
    }
}
// 239232   8501   2229706    63250   1613689679   cbaec11249867eb0e721b4b8f3cd55d993b7017f   2229706