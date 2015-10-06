var Emitter = require('emitter');
var doBroker = require('../');
var fixtures = require('../../../fixtures');
var room = fixtures.room;
var user = fixtures.user;
var org = fixtures.org;
var chatLine = fixtures.chatLine;

describe('Events Router', function () {
    it('should route user change events', function () {
        var ui = Emitter({
            'setUser': function (u) {
                expect(u).to.eql(user);
            }
        });
        var app = Emitter({});
        doBroker(ui, app);
        app.emit('changeUser', user);
    });
    it('should route organisation/s change events', function () {
        var ui = Emitter({
            'setOrganizations': function (os) {
                expect(os).to.be.eql(org);
            },
            'setOrganization': function (o) {
                expect(o).to.be.eql(org)
            }
        });
        var app = Emitter({});
        doBroker(ui, app);
        app.emit('change organizations', org);
        app.emit('change organization', org);
    });
    it('should route room join events', function () {
        var app = Emitter({
            'joinRoom': function (r) {
                expect(r).to.eql(room);
            }
        });
        var ui = Emitter({});
        doBroker(ui, app);
        ui.emit('joinRoom', room);
    });
    it('should route history requests', function () {
        var ui = Emitter({
            'gotHistory': function (r, lines) {
                expect(r).to.eql(room);
                expect(lines[0]).to.eql(chatLine);
            }
        });
        var app = Emitter({
            'getHistory': function (r) {
                expect(r).to.eql(room);
                this.emit('gotHistory', room, [chatLine]);
            }
        });
        doBroker(ui, app);
        ui.emit('needhistory', room);
    })
});