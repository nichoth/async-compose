var Stack = require('../')
var test = require('tape')

var context = {
    id: function (arg) { return arg }
}

test('.use', function (t) {
    t.plan(5)
    Stack()
        .use(function (req, res, next) {
            t.equal(req.n, 1)
            t.equal(res.n, 2)
            next()
        })
        .use(function (req, res, next) {
            t.pass('should call next function')
            t.equal(this.id('foo'), 'foo', 'should call with context')
            req.n++
            next()
        })
        .use(function (req, res, next) {
            t.equal(req.n, 2)
            next()  // should do nothing if there's no more functions
        })
        .go({ n: 1 }, { n: 2 }, context)
})

test('.go', function (t) {
    t.plan(1)
    var stack = Stack()
        .use(function (req, res, next) {
            t.pass('.go should return a function with the right context')
        })

    stack.go()(1, 2)
})

test('concurrency', function (t) {
    t.plan(2)
    var stack = Stack()
        .use(function (req, res, next) {
            t.equal(req.n, 0)
            req.n++
            setTimeout(function () {
                next()
            }, 10)
        })

    stack.go({ n: 0 }, { n: 0 })
    stack.go({ n: 0 }, { n: 0 })
})

