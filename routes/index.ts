import Route from '@core/Routes';
/**
 * Route:
 * Function:
 *    Method: get, post, put, delete, resource
 *    Route.<method>(path, Action).middleware([middleware1, middleware2])
 *    Ex: Route.get("/user", "UserController.index").middleware([auth])
 *    Route.resource("/user", "UserController")
 *
 *    Route.group(() =>{...}).prefix(path).middleware([middleware1, middleware2])
 *    Ex: Route.group(() =>{
 *        Route.get("/user", "UserController.index")
 *        Route.group("/user", "UserController.index")
 *        require("./setting") //load all router in ./setting.js
 *    }).prefix("/api/v1").middleware([auth])
 */
require("./arena")
require("./api")
require("./admin")

Route.get("/", function ({ request, response, next }) {
  response.redirect("/admin");
})
Route.get("/health", function ({ request, response, next }) {
  response.status(200).send("OK");
})

Route.router.use("/", require("express").static('@root/../public'));
Route.router.use("/public", require("express").static('@root/../public'));
