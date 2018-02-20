function Stack () {
    if (!(this instanceof Stack)) return new Stack()
    this._fns = []
}

Stack.prototype.use = function (fn) {
    var self = this

    function handler (req, res, context) {
        fn.call(context, req, res, function () {
            if (handler.next) handler.next(req, res, context)
        })
    }

    var prev = this._fns[this._fns.length - 1]
    if (prev) prev.next = function (req, res, context) {
        handler.call(self, req, res, context)
    }

    this._fns.push(handler)
    return this
}

Stack.prototype.go = function (req, res, context) {
    if (!req) {
        var self = this
        return function (_req, _res, _context) {
            return self.go(_req, _res, _context)
        }
    }

    this._fns[0](req, res, context)
    return this
}

module.exports = Stack

