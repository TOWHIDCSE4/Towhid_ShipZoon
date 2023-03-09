import Route from '@core/Routes'
const AuthAdminMiddleware = require('@app/Middlewares/AuthAdminMiddleware')

Route.get("/admin/login", "pages/admin/login").name("frontend.admin.login")
Route.get("/forgot-password", "pages/admin/forgotPassword").name("frontend.admin.forgotPassword")
Route.get("/reset-password/:token", "pages/admin/resetPassword").name("frontend.admin.resetPassword")
Route.get("/user-temp/:token", "pages/users/createTemp").name("frontend.users.createTemp")

Route.group(() => {
  Route.get("/", `pages/admin/users/myUser`).name(`users.myUser`).parent(`users.index`).sidebar(`users.index`)

  
  // api fontend aplication start
  {
    let name = 'documentTemplates'
    Route.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/:id/edit`, `pages/admin/${name}/edit`).name(`${name}.edit`).parent(`documentTemplates.index`).sidebar(`documentTemplates.index`)
    Route.get(`/${name}/:id/copy`, `pages/admin/${name}/copy`).name(`${name}.copy`).parent(`documentTemplates.index`).sidebar(`documentTemplates.index`)
    Route.get(`/${name}/create`, `pages/admin/${name}/create`).name(`${name}.create`).parent(`documentTemplates.index`).sidebar(`documentTemplates.index`)
  }
  {
    let name = 'documents'
    Route.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/:id/create`, `pages/admin/${name}/create`).name(`${name}.create`).parent(`documents.overView`).sidebar(`documents.overView`)
    // Route.get(`/${name}/draft`, `pages/admin/${name}/draft`).name(`${name}.draft`).sidebar(`${name}.draft`)
    Route.get(`/${name}/:id/detailDraft`, `pages/admin/${name}/detailDraft`).name(`${name}.detailDraft`).parent(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/:id/detail`, `pages/admin/${name}/detail`).name(`${name}.detail`).parent(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/overView`, `pages/admin/${name}/overView`).name(`${name}.overView`).sidebar(`${name}.overView`)
  }
  

  //end

  {
    let name = 'login'
    Route.get(`/${name}/twofa`, `pages/admin/${name}/twofa`).name(`${name}.twofa`)
  }
  
  {
    let name = 'users'
    Route.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/create`, `pages/admin/${name}/create`).name(`${name}.create`).parent(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/:id/edit`, `pages/admin/${name}/edit`).name(`${name}.edit`).parent(`${name}.index`).sidebar(`${name}.index`)
    // Route.get(`/${name}/:id/editTmp`, `pages/admin/${name}/editTmp`).name(`${name}.editTmp`).parent(`${name}.index`).sidebar(`${name}.index`)

    Route.get(`/${name}/twofa`, `pages/admin/${name}/twoFa`).name(`${name}.twofa`).parent(`${name}.index`).sidebar(`${name}.twoindexfa`)
    Route.get(`/${name}/create-temp`, `pages/admin/${name}/createTemp`).name(
		`${name}.createTemp`);
    Route.get(`/${name}/myUser`, `pages/admin/${name}/myUser`).name(`${name}.myUser`).parent(`${name}.index`).sidebar(`${name}.index`)
  }
  
  {
    let name = 'roles'
    Route.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/create`, `pages/admin/${name}/create`).name(`${name}.create`).parent(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/:id/edit`, `pages/admin/${name}/edit`).name(`${name}.edit`).parent(`${name}.index`).sidebar(`${name}.index`)
    // Route.get(`/${name}/:id/role`, `pages/admin/${name}/role`).name(`${name}.role`).parent(`${name}.index`).sidebar(`${name}.index`)
  }

  {
    let name = 'tenants'
    Route.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/create`, `pages/admin/${name}/create`).name(`${name}.create`).parent(`${name}.index`).sidebar(`${name}.index`)
    Route.get(`/${name}/:id/edit`, `pages/admin/${name}/edit`).name(`${name}.edit`).parent(`${name}.index`).sidebar(`${name}.index`)
  }

  {
    let name = 'powerBi'
    Route.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`)
  }

  {    
  let name = 'invoices'
  Route.get(`/${name}`, `pages/admin/${name}`).name(`${name}.index`).sidebar(`${name}.index`)
  Route.get(`/${name}/:id/detail`, `pages/admin/${name}/detail`).name(`${name}.detail`).parent(`${name}.index`).sidebar(`${name}.index`)
  }

}).name("frontend.admin").prefix("/admin").middleware([AuthAdminMiddleware])