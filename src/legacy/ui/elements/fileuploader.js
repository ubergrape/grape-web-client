import Emitter from 'emitter';
import Upload from 'upload';
import Progress from 'progress';
import file from 'file';
import template from 'template';
import qs from 'query';
import render from '../rendervdom';
import classes from 'classes';

module.exports = Uploader

function Uploader(uploadPath) {
  Emitter.call(this)
  this.uploadPath = uploadPath
  this.org = {id: 0}
  this.init()
  this.bind()
}

Uploader.prototype = Object.create(Emitter.prototype)

Uploader.prototype.init = function Uploader_init() {
  let vdom = template('fileuploader.jade', {})
  render(this, vdom)
  this.classes = classes(this.el)

  this.input = qs('input', this.el)
  this.trigger = qs('.trigger', this.el)
  // append progress widget
  this.progress = new Progress()
  this.progress.size(24)
  qs('.progress', this.el).appendChild(this.progress.el)
  // get the preview container
  this.preview = qs('.preview', this.el)
}

Uploader.prototype.bind = function Uploader_bind() {
  let self = this
  this.trigger.addEventListener('click', function () { self.input.click(); })
  this.input.addEventListener('change', function () {
    for (let i = 0; i < this.files.length; i++){
      self.doUpload(this.files[i])
    }
    // the uploader input takes action only when the form changes,
    // so after each upload, clear the form value so that any file can be uploaded twice
    self.input.value = ''
  })
}

Uploader.prototype.doUpload = function Uploader_doUpload(file) {
  let self = this
  self.progress.update(0)
  self.showPreview(file)
  let upload = new Upload(file)
  this.emit('uploading')
  upload.on('progress', function (progress) {
    self.progress.update(progress.percent)
  })
  upload.to({
    path: self.uploadPath,
    data: {organization: self.org.id}
  }, function (err, res) {
    if (err) return self.emit('error', err)
    res = JSON.parse(res.responseText)
    self.emit('uploaded', res)
  })
}


Uploader.prototype.setOrganization = function Uploader_setOrganization(org) {
  this.org = org
}

Uploader.prototype.showPreview = function Uploader_updatePreview(f) {
  let self = this
  file(f).toDataURL(function (err, url) {
    self.preview.src = url
    self.classes.add('open')
  })
}

Uploader.prototype.hide = function Uploader_hide() {
  this.classes.remove('open')
}
