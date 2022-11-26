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
    await handler(req, res, url, rawRequest)
  }

  #getHandler(req, url) {
    const { pathname } = url
    const methods = this.routes.get(pathname) ?? {}
    return methods[req?.method]
  }

  #getURL(req) {
    return new URL(req.url || '/', `https://${req.headers.host}`)
  }

  async #getRawRequestData(req) {
    let rawRequest = ''

    for await (const chunk of req) {
      rawRequest += chunk
    }

    return rawRequest
  }
}

export default Router
