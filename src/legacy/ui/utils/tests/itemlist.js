import expect from 'expect.js'
import Emitter from 'emitter'
import ItemList from '../itemlist'
import {room, anotherRoom} from '../../../tests/fixtures/'
import '../../../templates'

let roomList = new ItemList({
  'template': 'dialogs/roomlist.jade'
})

describe('ItemList', () => {
  it('should be able to emit events', () => {
    expect(roomList).to.be.a(Emitter)
  })
  it('should have an empty item list by default', () => {
    expect(roomList.items).to.be.empty()
  })
  it('should have no selected item by default', () => {
    expect(roomList.selected).to.be(null)
  })
  it('should be possible to redraw', () => {
    expect(roomList.redraw).to.be.a('function')
  })
  it('should accept items', () => {
    let rooms = [room, anotherRoom]
    roomList.setItems(rooms)
    expect(roomList.items).to.eql(rooms)
  })
  it('should offer a way to select items', () => {
    roomList.selectItem(room)
    expect(roomList.selected).to.eql(room)
  })
  it('should contain no more than one selected item at once', () => {
    roomList.selectItem(anotherRoom)
    expect(roomList.selected).to.be.an('object')
    expect(roomList.selected).to.be.eql(anotherRoom)
  })
  it('should be able to order its items', () => {
    roomList.order('slug')
    expect(roomList.items[0]).to.be.eql(anotherRoom)
  })
})
