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
            setUser: function (_user) {
                expect(_user).to.eql(user);
            }
        });
        var app = Emitter({});
        doBroker(ui, app);
        app.emit('changeUser', user);
    });
    it('should route organisation/s change events', function () {
        var ui = Emitter({
            setOrganizations: function (_orgs) {
                expect(_orgs).to.be.eql(org);
            },
            setOrganization: function (_org) {
                expect(_org).to.be.eql(org)
            }
        });
        var app = Emitter({});
        doBroker(ui, app);
        app.emit('change organizations', org);
        app.emit('change organization', org);
    });
    it('should route room join events', function () {
        var app = Emitter({
            joinRoom: function (_room) {
                expect(_room).to.eql(room);
            }
        });
        var ui = Emitter({});
        doBroker(ui, app);
        ui.emit('joinRoom', room);
    });
    it('should route history requests', function () {
        var ui = Emitter({
            gotHistory: function (_room, lines) {
                expect(_room).to.eql(room);
                expect(lines[0]).to.eql(chatLine);
            }
        });
        var app = Emitter({
            getHistory: function (_room) {
                expect(_room).to.eql(room);
                this.emit('gotHistory', room, [chatLine]);
            }
        });
        doBroker(ui, app);
        ui.emit('needhistory', room);
    })
});