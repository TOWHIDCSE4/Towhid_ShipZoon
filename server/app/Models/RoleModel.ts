import BaseModel from './BaseModel'

class RoleModel extends BaseModel {
  static tableName = "roles"

  //fields
  id: number;  
  code: string;
  name: string;
  description: string;
  key: string;
  others: any;  
  parentId: number;
  tenantId: number;
  createdBy: number;
  updatedBy: number;


  static async getChildrenRoles(roleId) {

    let results = [];
    if (!roleId) return results;
    let current = await this.getById(roleId);
    if (!current) return results;
    results.push(current);
    let parentIds = [roleId]
    let isContinue = true;

    while (isContinue) {
      let children = (parentIds.length) ? await this.query().whereIn("parentId", parentIds) : [];
      if (children.length) {
        results = results.concat(children);
        parentIds = children.map(e => e.id);
        parentIds = parentIds.filter(e => e);
      } else {
        isContinue = false;
      }
    }

    return results;
  }

  
  /**
   * Lấy  location Lon nhat
   */
  static async getLastParent(roleId: number) {

    let roles: any = await this.getById(roleId);
    if (!roles) return null;
    if (!roles.parentId) return roles;
    let prevLocation :any
    while (roles.parentId) {
      roles = await this.getById(roles.parentId);
      prevLocation = {...roles};
    }
    return prevLocation;
  }


}

export default RoleModel
