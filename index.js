function go (req, res, context) {
    if (!req) {
        var self = this
        return function () {
            return self.apply(self, arguments)
        }
    }
    return this.first(req, res, context)
}

go.use = use
function use (fn) {
    function handler (req, res, context) {
        fn.call(context, req, res, function next () {
            if (handler.next) handler.next(req, res, context)
        })
    }

    if (!(this.first)) {
        function _go (req, res, context) {
            return go.apply(_go, arguments)
        }
        _go.first = handler
        _go.last = handler
        _go.use = use
        return _go
    }

    this.last.next = handler
    this.last = handler
    return this
}

module.exports = go

