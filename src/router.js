import helpers from './helpers.js'
import { safeJSON } from './utils.js'

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

    const reqData = new ReqData(req)
    const { rawRequest, payload } = await reqData.get()

    const gibridRes = Object.assign(res, helpers)
    await handler(req, gibridRes, url, payload, rawRequest)
  }

  #getURL(req) {
    return new URL(req.url || '/', `https://${req.headers.host}`)
  }

  #getHandler(req, url) {
    const { pathname } = url
    const methods = this.routes.get(pathname) ?? new Map()
    return methods.get(req?.method) ?? this.#defaultHandler
  }

  #defaultHandler(req, res, url, payload, rawRequest) {
    res.json({ message: 'method not implemented' })
  }
}

class ReqData {
  #req
  #contentTypes
  #currentСontentType
  #rawRequest = ''
  #payload = {}
  #processedContentTypes = {
    'text/html': (text) => text,
    'text/plain': (text) => text,
    'application/json': (json) => safeJSON(json, {}),
    'application/x-www-form-urlencoded': (data) => {
      return Object.fromEntries(new URLSearchParams(data))
    },
  }

  constructor(req) {
    this.#req = req
    this.#contentTypes = req.headers['content-type'] ?? ''
  }

  async get() {
    await this.#processReqData()
    return {
      rawRequest: this.#rawRequest,
      payload: this.#payload,
    }
  }

  async #processReqData() {
    await this.#extractRawRequestData()
    this.#makePayload()
  }

  async #extractRawRequestData() {
    for await (const chunk of this.#req) {
      this.#rawRequest += chunk
    }
  }

  #makePayload() {
    this.#extractContentType()

    if (this.#contentTypeHandlerExists()) {
      this.#payload = this.#procesRawRequestData()
    }
  }

  #extractContentType() {
    if (this.#contentTypeExists()) {
      this.#currentСontentType = this.#contentTypes.split(';')[0]
    }
  }

  #contentTypeExists() {
    return !!this.#contentTypes
  }

  #contentTypeHandlerExists() {
    return !!this.#processedContentTypes[this.#currentСontentType]
  }

  #procesRawRequestData() {
    return this.#processedContentTypes[this.#currentСontentType](
      this.#rawRequest
    )
  }
}

export default Router
