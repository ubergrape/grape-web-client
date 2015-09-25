var Emitter = require('emitter');
var doBroker = require('../');

describe('Events Router', function () {
    it('should route user change events', function () {
        var ui = Emitter({
            'setUser': function (u) {
                expect(u).to.eql(user);
                done();
            }
        });
        var app = Emitter({});
        broker(ui, app);
        app.emit('changeUser', user);
    });
});