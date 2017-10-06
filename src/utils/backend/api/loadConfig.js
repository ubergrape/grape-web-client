import request from 'superagent'

export default ({serviceUrl, authToken}) => new Promise((resolve, reject) => {
  const req = request.get(`${serviceUrl}/api/chat/config/`)
  if (authToken) req.set('Authorization', `Token ${authToken}`)
  req.end((err, res) => {
    if (err) return reject(err)
    return resolve(res.body)
  })
})
