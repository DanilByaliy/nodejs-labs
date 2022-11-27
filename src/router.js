import helpers from './helpers'

class Router {
  routes = new Map()

  constructor() {
    this.get = this.addHandler.bind(this, 'GET')
    this.post = this.addHandler.bind(this, 'POST')
    this.patch = this.addHandler.bind(this, 'PATCH')
    this.delete = this.addHandler.bind(this, 'DELETE')
    this.options = this.addHandler.bind(this, 'OPTIONS')
  }

  addHandler(method, path, handler) {
    const route = this.#getRoute(path)
    route.set(method, handler)
  }

  #getRoute(path) {
    let route = this.routes.get(path)

    if (!route) {
      route = new Map()
      this.routes.set(path, route)
    }
    return route
  }

  async handle(req, res) {
    const url = this.#getURL(req)
    const handler = this.#getHandler(req, url)
    const rawRequest = await this.#getRawRequestData(req)

    const gibridRes = Object.assign(res, helpers)
    await handler(req, gibridRes, url, rawRequest)
  }

  #getURL(req) {
    return new URL(req.url || '/', `https://${req.headers.host}`)
  }

  #getHandler(req, url) {
    const { pathname } = url
    const methods = this.routes.get(pathname) ?? {}
    return methods[req?.method] ?? this.#defaultHandler
  }

  async #getRawRequestData(req) {
    let rawRequest = ''

    for await (const chunk of req) {
      rawRequest += chunk
    }

    return rawRequest
  }

  #defaultHandler(req, res, url, rawRequest) {
    res.json({ message: 'method not implemented' })
  }
}

export default Router
