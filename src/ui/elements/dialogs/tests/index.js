var expect = require('expect.js');
var Dialog = require('../dialog');
var qs = require('query');
var MDTip = require('../markdowntips');
var RoomDelete = require('../deleteroom');
var PMManager = require('../pmmanager');
var RoomManager = require('../roommanager');

var mdTip = new MDTip();
var roomDelete = new RoomDelete({
    room: room
});
var roomManager = new RoomManager({
    rooms: [room]
});

describe('Dialog', function (){
    describe('Markdown Dialog', function () {
        it('should have a DOM element', function () {
            expect(mdTip).to.have.property('el');
            expect(mdTip.el).to.be.a(Element);
        });
        it('should open', function () {
            mdTip.show();
            var el = qs('.markdown-tips', mdTip.el);
            expect(el).not.to.be(null);
        });
    });
    describe('Room Delete Dialog', function () {
        it('should have a DOM element', function () {
            expect(roomDelete).to.have.property('el');
            expect(roomDelete.el).to.be.a(Element);
        });
        it('should open', function () {
            roomDelete.show();
            var el = qs('.delete-room', roomDelete.el);
            expect(el).not.to.be(null);
        });
    });
    describe('Room Manager', function () {
        it('should have a DOM element', function () {
            expect(roomManager).to.have.property('el');
            expect(roomManager.el).to.be.a(Element);
        });
        it('should open', function () {
            roomManager.show();
            var el = qs('.room-list-container', roomManager.el);
            expect(el).not.to.be(null);
        });
    });
});