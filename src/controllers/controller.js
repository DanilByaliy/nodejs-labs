const contentType = 'application/json'

function get(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.json('success')
}

function post(req, res, url, payload, rawRequest) {
  res.writeHead(200, { 'Content-Type': contentType })
  res.json({
    pathname: url.pathname,
    method: req.method,
    message: 'POST method',
    payload,
    rawRequest,
  })
}

function patch(req, res, url, payload, rawRequest) {
  res.writeHead(200, { 'Content-Type': contentType })
  res.json({
    pathname: url.pathname,
    method: req.method,
    message: 'PATCH method',
    payload,
    rawRequest,
  })
}

function deleteHandler(req, res, url, payload, rawRequest) {
  res.writeHead(200, { 'Content-Type': contentType })
  res.json({
    pathname: url.pathname,
    method: req.method,
    message: 'DELETE method',
    payload,
    rawRequest,
  })
}

function options(req, res, url, payload, rawRequest) {
  res.writeHead(200, { 'Content-Type': contentType })
  res.json({
    pathname: url.pathname,
    method: req.method,
    message: 'OPTIONS method',
    payload,
    rawRequest,
  })
}

export default {
  get,
  post,
  patch,
  deleteHandler,
  options,
}
