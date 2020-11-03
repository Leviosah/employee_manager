const { prompt } = require("inquirer");
const { updateEmployeeRole, updateManager, queryAllRoles } = require("./db/index");
const db = require("./db/index")
require("console.table")



promptQuery();


async function promptQuery() {

    const { response } = await prompt([
        {
            type: "list",
            name: "response",
            message: "Please select from the following: ",
            choices: [
                {
                    name: "Query All Employees",
                    value: "getAllEmployees"
                },
                {
                    name: "Query Employees by Department",
                    value: "getEmpByDept"
                },
                {
                    name: "Query Employees by Manager",
                    value: "getEmpByMan"

                },
                {
                    name: "Add Employee",
                    value: "addEmp"

                },
                {
                    name: "Remove Employee",
                    value: "removeEmp"
                },
                {
                    name: "Update Employee Role",
                    value: "updateRole"
                },
                {
                    name: "Update Employee Manager",
                    value: "updateMan"
                },
                {
                    name: "View All Roles",
                    value: "queryAllRoles"
                },
                {
                    name: "Add a Role",
                    value: "addRole"
                },
                {
                    name: "Remove a Role",
                    value: "dropRole"
                },
                {
                    name: "View all Departments",
                    value: "queryAllDept"
                },
                {
                    name: "Add a Department",
                    value: "addDept"
                },
                {
                    name: "Remove a Department",
                    value: "dropDept"
                },
                {
                    name: "Quit",
                    value: "Quit"
                }

            ]
        }
    ])
    console.log(response)
    switch(response) { 
       case "getAllEmployees":
        return queryAllEmp();
       case "getEmpByDept":
        return queryEmpDept();
       case "getEmpByMan":
        return queryEmpMan();
       case "addEmp":
        return insertEmp();
       case "removeEmp":
        return dropEmp();
       case "updateRole":
        return updateRole();
       case "updateMan":
        return updateMan();
       case "queryAllRoles":
        return queryEveryRole();
       case "addRole":
        return addRole();
       case "dropRole":
        return dropRole();
       case "queryAllDept":
        return queryEveryDept();
       case "addDept":
        return addDept();
       case "dropDept":
        return dropDept();

        
    default:
       quit();
    }
}

async function test() {
    console.log("this is working")
}



async function queryAllEmp() {
    const allEmployees = await db.queryAllEmployees();

    console.log("\n")
    console.table(allEmployees)

    promptQuery();
}

async function queryEmpDept(){
    const allDept = await db.queryAllDepartments();
    const deptAvail = allDept.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { deptId } = await prompt([
        {
            type: "list",
            name: "deptId",
            message: "Please select the department",
            choices: deptAvail
        }
    ]);

    const allEmployees = await db.queryEmployeesByDept(deptId)

    console.log("\n")
    console.table(allEmployees);

    promptQuery();
}

async function queryEmpMan(){
    const allEmp = await db.queryAllEmployees();

    const managerAvail = allEmp.map(({ id, first_name, last_name}) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { managerId } = await prompt([
        {
            type: "list",
            name: "managerId",
            message: "Please select an employee to see directs",
            choices: managerAvail
        }
    ]);

    const employees = await db.queryEmployeesByManager(managerId)

    console.log("\n");

    if (employees.length === 0) {
        console.log("Employee has no directs");
    }else{
        console.table(employees)
    }

    promptQuery();

}

async function insertEmp() {
    const roles = await db.queryAllRoles();
    const employees = await db.queryAllEmployees();

    const newEmp = await prompt([
        {
            name: "first_name",
            message: "Please enter employee's first name"
        },
        {
            name: "last_name",
            message: "Please enter employee's last name"
        }
    ]);

    const rolesAvail = roles.map(({ id, title}) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt({
        type: "list",
        name: "roleId",
        message: "Please select a role for the new Employee",
        choices: rolesAvail
    });

    newEmp.role_id = roleId;

    const managersAvail = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    managersAvail.unshift({ name: "none", value: null});

    const { managerId } = await prompt({
        type: "list",
        name: "managerId",
        message: "Please select the new Employee's manager",
        choices: managersAvail
    })

    newEmp.manager_id = managerId
    await db.createEmployee(newEmp)

    console.log(`${newEmp.first_name} ${newEmp.last_name} has been added`)

    promptQuery();
}

async function dropEmp(){
    const employees = await db.queryAllEmployees();

    const empAvail = employees.map(({ id, first_name, last_name}) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { empId } = await prompt([
        {
            type: "list",
            name: "empId",
            message: "Please select an employee to remove",
            choices: empAvail
        }
    ]);

    await db.deleteEmployee(empId);

    console.log(`Removed from database`);

    promptQuery();

}

async function updateRole() {
    const employees = await db.queryAllEmployees();

    const empAvail = employees.map(({ id, first_name, last_name}) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { empId } = await prompt([
        {
            type: "list",
            name: "empId",
            message: "Please select the role to update",
            choices: empAvail
        }
    ]);

    const roles = await db.queryAllRoles();
    const rolesAvail = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message: "Please assign a role to the employee",
            choices: rolesAvail
        }
    ]);

    await db.updateEmployeeRole(empId, roleId)

    console.log("Employee role updated")

    promptQuery();
}

async function updateMan(){
    const employees = await db.queryAllEmployees();

    const employeeAvail = employees.map(({ id, first_name, last_name}) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }))

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Please select employee manager to update",
            choices: employeeAvail
        }
    ]);

    const managers = await db.queryAllManagers(employeeId);

    const managersAvail = managers.map(({ id, first_name, last_name}) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { managerId } = await prompt([
        {
            type: "list",
            name: "managerId",
            message: "Please select the employee that you want to set as direct to previously selected manager",
            choices: managersAvail
        }
    ]);

    await db.updateManager(employeeId, managerId);

    console.log("Manager has been updated")

    promptQuery();
}

async function queryEveryRole() {
    const allRoles = await db.queryAllRoles();

    console.log("\n");
    console.table(allRoles)

    promptQuery();
}

async function addRole() {
    const allDept = await db.queryAllDepartments();

    const deptAvail = allDept.map(({ id, name}) => ({
        name: name,
        value: id
    }));

    const role = await prompt([
        {
            name: "title",
            message: "Please input role name"
        },
        {
            name: "salary",
            message: "Please input role salary"
        },
        {
            type: "list",
            name: "department_id",
            message: "Please select department that the role is under",
            choices: deptAvail
        }
    ]);

    await db.createRole(role);

    console.log(`${role.title} has been added`);

    promptQuery();

}

async function dropRole() {
    const allRoles = await db.queryAllRoles();

    const rolesAvail = allRoles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message: "Please select the role to remove",
            choices: rolesAvail
        }
    ]);

    await db.deleteRole(roleId);

    console.log("Role has been removed")

    promptQuery();gt
}

async function queryEveryDept() {
    const allDept = await db.queryAllDepartments();

    console.log("\n");
    console.table(allDept);

    promptQuery();
}

async function addDept() {
    const dept = await prompt([
        {
            name: "name",
            message: "Please enter department name"
        }
    ]);

    await db.createDepartment(dept);

    console.log(`${dept.name} has been added`);

    promptQuery();
}

async function dropDept() {
    const dept = await db.queryAllDepartments();

    const deptAvail = dept.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { deptId } = await prompt({
        type: "list",
        name: "deptId",
        message: "Please select the department to remove",
        choices: deptAvail
    });

    await db.deleteDepartment(deptId);

    console.log(`Department removed`)

    promptQuery();
}

function quit() {
    console.log('Quitting')
    process.exit();
}