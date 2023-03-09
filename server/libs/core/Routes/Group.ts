
//const Group = require("./group")
import Route from './route'

const fs = require('fs')
class Group {
  router: any
  _groups: Group[]
  _name: any
  _register: Function
  _routes: Route[]
  _prefix: string
  middlewares: any
  pointToObject: any
  routes: any = {
    __NOTE__: {
      "note": "Do not edit this file. It is automatically generated by the system. To edit routes, please edit the file: routes/frontend.xxx.js"
    }
  }

  get rootGroup(): Group {
    return require('./index').default
  }
  constructor() {
    this.router = require('express').Router(); //chắc chắn mỗi group khởi tạo 1 đối tượng router mới
    this._groups = []; //danh sách cá nhóm con của Group
    this._name = null; //tên group
    this._register = null; //hàm callback
    this._routes = []; //danh sách các route của group
    this._prefix = "/"; //prefix
    this.middlewares = [] //mảng middleware của group
  }


  //tạo điểm checkpoint để dánh dấu đang tạo route cho group nào.
  getPoint() {
    return this.rootGroup.pointToObject || this
  }

  /**
   *
   * đăng ký hàm callback cho group.
   */
  setRegister(register) {
    this._register = register
  }

  build(prefixName?, prerixRoute?, middlewares = []) {
    if (middlewares.length > 0) {
      this.middlewares = [
        ...middlewares,
        ...this.middlewares
      ]
    }
    if (typeof this._register === "function") {
      //cho các group
      this._register()
    } else {
      //cho hàm build gốc
      const userRoute = require("@root/routes")
    }
    //gán middleware
    if (this.middlewares.length > 0) this.router.use(...this.middlewares);
    let name = prefixName;
    if (this._name) {
      name = prefixName != null ? `${prefixName}.${this._name}` : this._name
    }
    let prefix = prerixRoute != null ? `${prerixRoute}/${this._prefix}` : this._prefix

    //gán các router trực tiếp của group
    this._routes.forEach(route => {
      // this.router.use(route.build(name, prefix, this.middlewares))
      this.router.use(route.build(name, prefix))
    });
    //truy vấn router của các group nhỏ hơn
    this._groups.forEach(group => {
      this.rootGroup.pointToObject = group;
      // this.router.use(group.getPrefix(), group.build(name, prefix, this.middlewares))
      this.router.use(group.getPrefix(), group.build(name, prefix))
    });

    return this.router
  }

  /** group method */
  group(register) {
    const group = new Group();
    group.setRegister(register);
    this.getPoint()._groups.push(group);
    return group
  }

  getPrefix() {
    return this._prefix
  }

  /**
   * Route.group(() => {...}).prefix("/url/to/api")
   */
  prefix(path) {
    this._prefix = path;
    return this
  }

  /**
   * Route.group(() => {...}).middleware([middleware1,middleware2])
   */
  middleware(middlewares) {
    this.middlewares = [
      ...this.middlewares,
      ...middlewares
    ];
    return this
  }

  use(path, router) {
    this.group(() => { }).prefix(path).middleware([router])
  }

  //route method
  addMethod(url, action, method) {
    //console.log(`add route: [${method}] ${url} ${action}`)
    const route = new Route(url, action, method);
    this.getPoint()._routes.push(route);
    return route
  }

  get(url, action) {
    return this.addMethod(url, action, "get")
  }

  post(url, action) {
    return this.addMethod(url, action, "post")
  }

  put(url, action) {
    return this.addMethod(url, action, "put")
  }

  delete(url, action) {
    return this.addMethod(url, action, "delete")
  }

  resource(url, controller) {
    return this.group(() => {
      let Route = require('@core/Routes').default;
      Route.get("/", `${controller}.index`).name('index');
      Route.post("/", `${controller}.store`).name('store');
      Route.get("/:id", `${controller}.detail`).name('detail');
      Route.put("/:id", `${controller}.update`).name('update');
      Route.delete("/:id", `${controller}.destroy`).name('destroy');
      Route.delete("/", `${controller}.delete`).name('delete')
    }).prefix(url)
  }

  route(name, params) {
    let route = this.rootGroup.routes[name]
    if (route) {
      return route.makeUrl(params)
    }
    else {
      throw Error(`Route ${name} not found.`)
    }
  }

  name(routeName) {
    this._name = routeName
    return this
  }

  export(pathFile?: string) {
    if (pathFile)
      fs.writeFile(pathFile, JSON.stringify(this.rootGroup.routes, null, 2), () => { });
    else
      return this.rootGroup.routes
  }
}

export default Group
