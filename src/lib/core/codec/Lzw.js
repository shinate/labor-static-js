module.exports = {
    'decode': function (arrBytes, nBits) {
        var cc = 1 << (nBits - 1);
        var eoi = cc + 1;
        var table = [], mask = [], result = [];

        var i;
        for (i = 0; i < cc; i++) {
            table[i] = '' + (i >> 8 & 0xf).toString(16) + (i >> 4 & 0xf).toString(16) + (i & 0xf).toString(16);
        }
        for (i = 2, mask[1] = 1; i < 13; i++) {
            mask[i] = mask[i - 1] << 1 | 1;
        }
        var bc = nBits;
        var pos = 0, temp = 0, tleft = 0, code = 0, old = 0;

        while (true) {
            while (tleft < bc) {
                temp = temp | (arrBytes[pos++] << tleft);
                tleft += 8;
            }
            code = temp & mask[bc];
            tleft -= bc;
            temp >>= bc;
            if (code == eoi) {
                break;
            }
            if (code == cc) {
                table.length = cc + 2;
                bc = nBits;
                old = code;
                continue;
            }
            var t = "";
            if (code < table.length) {
                t = table[code];
                if (old != cc) {
                    table.push(table[old] + t.slice(0, 3));
                }
            } else if (old < table.length) {
                t = table[old] + table[old].slice(0, 3);
                table.push(t);
            } else {
                throw "ERROR：Image data is invalid";
                return;
            }

            old = code;
            for (i = 0; i < t.length; i += 3) {
                result.push(parseInt(t.substr(i, 3), 16));
            }
            if (table.length == 1 << bc && bc < 12) {
                bc++;
            }
        }
        return result;
    }
}
