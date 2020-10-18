const connection = require("./connection");

class Database {

    constructor(connection) {
        this.connection = connection;
    }

    queryAllEmployees() {
        return this.connection.query(
            "SELECT employee.id" +
            ", employee.first_name" +
            ", employee.last_name" +
            ", role.title" +
            ", department.name AS dept_name" +
            ", role.salary" +
            ", CONCAT(manager.first_name, ' ', manager.last_name) AS manager" +
            "FROM employee" +
            "LEFT JOIN role on employee.role_id = role.id" +
            "LEFT JOIN department on role.department_id = department.id" +
            "LEFT JOIN employee manager on manager.id = employee.manager_id"
        )
    }

    queryAllManagers(employeeId) {
        return this.connection.query(
            "SELECT id" +
            ", first_name" +
            ", last_name" +
            "FROM employee" +
            "WHERE id != ?", employeeId
        );
    }

    createEmployee(employee) {
        return this.connection.query(
            "INSERT INTO employee SET ?", employee
        );
    }

    deleteEmployee(employeeId) {
        return this.connection.query(
            "DELETE FROM employee" +
            "WHERE id = ?", employeeId
        );
    }

    updateEmployeeRole(roleId, employeeId) {
        return this.connection.query(
            "UPDATE employee SET role_id = ?" +
            "WHERE id = ?",
            [roleId, employeeId]
        );
    }


    updateManager(managerId, employeeId) {
        return this.connection.query(
            "UPDATE employee SET manager_id = ?" +
            "WHERE id = ?",
            [managerId, employeeId]
        );
    }

    queryAllRoles() {
        return this.connection.query(
            "SELECT role.id" +
            ", role.title" +
            ", department.name AS dept_name" +
            ", role.salary" +
            "FROM role" +
            "LEFT JOIN department on role.department_id = department.id"      
        );        
    }

    createRole(role) {
        return this.connection.query(
            "INSERT INTO role SET ?", role
        );
    }

    deleteRole(roleId) {
        return this.connection.query(
            "DELETE FROM role" +
            "WHERE id = ?", roleId
        );
    }

    queryAllDepartments() {
        return this.connection.query(
            "SELECT department.id" +
            ", department.name" +
            ", SUM(role.salary) AS total_salary" +
            "FROM employee" +
            "LEFT JOIN role on employee.role_id = role.id" +
            "LEFT JOIN department on role.department_id = department.id" +
            "GROUP BY department.id, department.name"
        );
    }

    createDepartment(department) {
        return this.connection.query(
            "INSERT INTO department SET ?", department
        );
    }

    deleteDepartment(departmentId) {
        return this.connection.query(
            "DELETE FROM department" +
            "WHERE id = ?", departmentId
        );
    }


    queryEmployeesByDept(departmentId) {
        return this.connection.query(
            "SELECT employee.id" +
            ", employee.first_name" +
            ", employee.last_name" +
            ", role.title" +
            "FROM employee" +
            "LEFT JOIN role on employee.role_id = role.id" +
            "LEFT JOIN department on role.department_id = department.id" +
            "WHERE department.id = ?", departmentId
        )
    }

    queryEmployeesByManager(managerId) {
        return this.connection.query(
            "SELECT employee.id" +
            ", employee.first_name" +
            ", employee.last_name" +
            ", department.name AS dept_name" +
            ", role.title" +
            "FROM employee" +
            "LEFT JOIN role on role.id = employee.role_id" +
            "LEFT JOIN department on department.id = role.department_id" +
            "WHERE manager_id = ?", managerId
        );
    }
}

module.exports = new Database(connection)