# async compose

Middleware-like composition of async functions, intended for http servers

## install

    $ npm install @nichoth/async-compose

## example

```js
var Stack = require('../')
var test = require('tape')

var context = {
    id: function (arg) { return arg }
}

test('.use', function (t) {
    t.plan(5)
    var stack = Stack
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

    stack({ n: 1 }, { n: 2 }, context)
})

test('stop early', function (t) {
    t.plan(1)
    var stack = Stack
        .use(function (req, res, next) {
            t.pass('should call')
        })
        .use(function (req, res, next) {
            t.fail('should not call this')
            next()
        })

    stack({ n: 1 }, { n: 2 }, context)
})


test('.go', function (t) {
    t.plan(1)
    var stack = Stack
        .use(function (req, res, next) {
            t.pass('.go should return a function with the right context')
        })

    stack()(1, 2)
})

test('concurrency', function (t) {
    t.plan(2)
    var stack = Stack
        .use(function (req, res, next) {
            t.equal(req.n, 0)
            req.n++
            setTimeout(function () {
                next()
            }, 10)
        })

    stack({ n: 0 }, { n: 0 })
    stack({ n: 0 }, { n: 0 })
})
```

