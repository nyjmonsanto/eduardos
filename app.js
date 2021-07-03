const express = require("express"),
      session = require("express-session"),
      ejs = require("ejs"),
      mysql = require("mysql"),
      bodyParser = require("body-parser"),
      urlencodedParser = bodyParser.urlencoded({extended: false}),
      methodOverride = require("method-override"),
      bcrypt = require("bcrypt-nodejs"),
      saltRounds = 10,
      app = express();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "eduardosdb"
});

connection.connect((err) => {
    if(err){
        throw(err);
    }else{
        console.log("Connected To Database");
    }
});

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static("./assets"));
app.use(session({
    secret: "0p3/|/S3s@^^3",
    saveUninitialized: true,
    resave: true
}));
/*----------------------------------------------------------------------------------------------------*/
//USER LOGIN
app.get("/", (req, res) => {
    res.render("login");
});
app.post("/", urlencodedParser, (req, res) => {
    connection.query("SELECT * FROM employeetable WHERE employeeid = '"+req.body.employeeid+"'", (err) => {
        if(err){
            throw(err);
        }else{
            connection.query("SELECT * FROM ordertable WHERE DATE(logdate) = CURRENT_DATE ORDER BY orderuuid DESC LIMIT 1", (err, post) => {
                if(err){
                    throw(err);
                }

                if(post[0] == 'NULL'){
                    req.session.orderid = 1;
                    req.session.customerid = 1;
                } else {
                    req.session.orderid = post[0].orderid + 1;
                    req.session.customerid = post[0].customerid + 1;
                }
            })
            connection.query("SELECT * FROM usertable WHERE employeeid = '"+req.body.employeeid+"'", (err, response) => {
                if(err){
                    throw(err);
                }else{
                    if(response.length > 0){
                        let result = bcrypt.compareSync(req.body.userpassword, response[0].userpassword);
                        if(result){
                            req.session.logged = true;
                            req.session.employeeid = response[0].employeeid;
                            req.session.usertype = response[0].usertype;
                            if(req.session.usertype == "Admin"){
                                console.log("success");
                                res.redirect("/employees");
                            }else{
                                console.log("success");
                                res.redirect("/inventory");
                            }
                        }else{
                            console.log("failed");
                            res.redirect("/");
                        }
                    }
                }
            });
        }
    });
});
/*----------------------------------------------------------------------------------------------------*/
//ADMIN LOGIN
app.get("/admin-register", (req, res) => {
    res.render("admin-register");
});
app.post("/admin-login", urlencodedParser, (req, res) => {
    connection.query("SELECT * FROM employeetable WHERE employeeid = '"+req.body.employeeid+"'", (err) => {
        if(err){
            throw(err);
        }else{
            connection.query("SELECT * FROM ordertable WHERE DATE(logdate) = CURRENT_DATE ORDER BY orderuuid DESC LIMIT 1", (err, post) => {
                if(err){
                    throw(err);
                }

                if(post[0] == NULL){
                    req.session.orderid = 1;
                    req.session.customerid = 1;
                } else {
                    req.session.orderid = post[0].orderid + 1;
                    req.session.customerid = post[0].customerid + 1;
                }
            })
            connection.query("SELECT * FROM usertable WHERE employeeid = '"+req.body.employeeid+"'", (err, response) => {
                if(err){
                    throw(err);
                }else{
                    if(response.length > 0){
                        let result = bcrypt.compareSync(req.body.userpassword, response[0].userpassword);
                        if(result){
                            req.session.logged = true;
                            req.session.employeeid = response[0].employeeid;
                            req.session.usertype = response[0].usertype;
                            if(req.session.usertype == "Admin"){
                                console.log("success");
                                res.redirect("/employees");
                            }else{
                                console.log("failed");
                                res.redirect("/");
                            }
                        }else{
                            console.log("failed");
                            res.redirect("/");
                        }
                    }
                }
            });
        }
    });
});
//ADMIN REGISTER
app.post("/admin-register", urlencodedParser, (req, res) => {
    let sql1 = "INSERT INTO employeetable SET ?"
    let post1 = {
        employeerole: req.body.employeerole,
        has_account: 1
    }
    connection.query(sql1, post1, (err, res) => { 
        if(err){
            console.log("failed");
            throw(err);
        }else{
            console.log("success");
            console.log(res);
        }
    });
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(req.body.userpassword, salt);
    let sql2 = "INSERT INTO usertable SET ?"
    let post2 = {
        employeeid: 1,
        userpassword: hash,
        usertype: req.body.usertype
    }
    connection.query(sql2, post2, (err, res) => {
        if(err){
            console.log("failed");
            throw(err);
        }else{
            console.log("success");
            console.log(res);
        }
    });
    res.redirect("/admin-register");
});
/*----------------------------------------------------------------------------------------------------*/
//LOGOUT
app.get("/logout", (req, res) => {
    req.session.logged = false;
    res.redirect("/");
});
/*----------------------------------------------------------------------------------------------------*/
//EMPLOYEES SECTION
app.get("/employees", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT * FROM employeetable", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("employees", object);
            }
        });
    }
});
app.get("/employees-inactive", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT * FROM employeetable", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("employees-inactive", object);
            }
        });
    }
});
//ADD EMPLOYEE
app.get("/add-employee", (req, res) => {
    if(req.session.logged){
        res.render("add-employee", {usertype: req.session.usertype});
    }
});
app.post("/add-employee", urlencodedParser, (req, res) => {
    if(req.session.logged){
        let sql = "INSERT INTO employeetable SET ?"
        let post = {
            employeefirstname: req.body.employeefirstname,
            employeemiddlename: req.body.employeemiddlename,
            employeelastname: req.body.employeelastname,
            employeecontact: req.body.employeecontact,
            employeeemail: req.body.employeeemail,
            employeerole: req.body.employeerole,
            employeesalary: req.body.employeesalary
        }
        connection.query(sql, post, (err, res) => { 
            if(err){
                throw(err);
            }else{
                console.log("success");
                console.log(res);
            }
        });
        res.redirect("/employees");
    }
});
//UPDATE EMPLOYEE
app.get("/employees/:employeeid/update-employee", (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM employeetable WHERE employeeid = '"+req.params.employeeid+"'", (err, response) => {
            if(err){
                throw(err);
            }else{
                console.log(response);
                res.render("update-employee", {employee: response[0], usertype: req.session.usertype});
            }
        });
    }
});
app.put("/employees/:employeeid", urlencodedParser, (req, res) => {
    if(req.session.logged){
        connection.query("UPDATE employeetable SET employeefirstname = '"+req.body.employeefirstname+"', employeemiddlename = '"+req.body.employeemiddlename+"', employeelastname = '"+req.body.employeelastname+"', employeecontact = '"+req.body.employeecontact+"', employeeemail = '"+req.body.employeeemail+"', employeerole = '"+req.body.employeerole+"', employeesalary = '"+req.body.employeesalary+"', employeeavailability = '"+req.body.employeeavailability+"' WHERE employeeid = ?", [req.params.employeeid], (err) => {
            if(err){
                throw(err);
            }else{
                res.redirect("/employees");
            }
        });
    }
});
app.get("/employees-inactive/:employeeid/update-employee-inactive", (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM employeetable WHERE employeeid = '"+req.params.employeeid+"'", (err, response) => {
            if(err){
                throw(err);
            }else{
                console.log(response);
                res.render("update-employee-inactive", {employee: response[0], usertype: req.session.usertype});
            }
        });
    }
});
app.put("/employees-inactive/:employeeid", urlencodedParser, (req, res) => {
    if(req.session.logged){
        connection.query("UPDATE employeetable SET employeefirstname = '"+req.body.employeefirstname+"', employeemiddlename = '"+req.body.employeemiddlename+"', employeelastname = '"+req.body.employeelastname+"', employeecontact = '"+req.body.employeecontact+"', employeeemail = '"+req.body.employeeemail+"', employeerole = '"+req.body.employeerole+"', employeesalary = '"+req.body.employeesalary+"', employeeavailability = '"+req.body.employeeavailability+"' WHERE employeeid = ?", [req.params.employeeid], (err) => {
            if(err){
                throw(err);
            }else{
                res.redirect("/employees-inactive");
            }
        });
    }
});
//EMPLOYEE CREATE ACCOUNT
app.get("/employees/:employeeid/employee-create-account", (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM employeetable WHERE employeeid = '"+req.params.employeeid+"'", (err, response) => {
            if(err){
                console.log("failed");
                throw(err);
            }else{
                console.log("success");
                console.log(response);
                res.render("employee-create-account", {employee: response[0]});
            }
        });
    }
});
app.post("/employees/:employeeid", urlencodedParser, (req, res) => {
    if(req.session.logged){
        let salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(req.body.userpassword, salt);
        let sql = "INSERT INTO usertable SET ?"
        let post = {
            employeeid: req.body.employeeid,
            userpassword: hash,
            usertype: req.body.usertype,
        }
        connection.query(sql, post, (err, res) => { 
            if(err){
                console.log("failed");
                throw(err);
            }else{
                console.log("success");
                console.log(res);
            }
        });
        connection.query("UPDATE employeetable SET has_account = 1 WHERE employeeid = ?", [req.params.employeeid], (err) => {
            if(err){
                throw(err);
            }else{
                console.log("success");
            }
        });
        res.redirect("/employees");
    }
});
//ACCOUNTS
app.get("/users", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT * FROM usertable", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("users", object);
            }
        });
    }
});
//UPDATE ACCOUNT
app.get("/users/:userid/update-user", (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM usertable WHERE userid = '"+req.params.userid+"'", (err, response) => {
            if(err){
                throw(err);
            }else{
                console.log(response);
                res.render("update-user", {user: response[0], usertype: req.session.usertype});
            }
        });
    }
});
app.put("/users/:userid", urlencodedParser, (req, res) => {
    if(req.session.logged){
        connection.query("UPDATE usertable SET usertype = '"+req.body.usertype+"' WHERE userid = ?", [req.params.userid], (err) => {
            if(err){
                throw(err);
            }else{
                console.log("success");
                res.redirect("/users");
            }
        });
    }
});
//DELETE ACCOUNT
app.delete("/users/:userid/:employeeid", (req, res) => {
    if(req.session.logged){
        connection.query("DELETE FROM usertable WHERE userid = '"+req.params.userid+"'", (err) => {
            if(err){
                throw(err);
            }
        });
        connection.query("UPDATE employeetable SET has_account = 0 WHERE employeeid = ?", [req.params.employeeid], (err) => {
            if(err){
                throw(err);
            }else{
                console.log("success");
            }
        });
        res.redirect("/users");
    }
});
/*----------------------------------------------------------------------------------------------------*/
//SUPPLIERS SECTION
app.get("/suppliers", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT * FROM suppliertable", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("suppliers", object);
            }
        });
    }
});
//ADD SUPPLIER
app.get("/add-supplier", (req, res) => {
    if(req.session.logged){
        res.render("add-supplier", {usertype: req.session.usertype});
    }
});
app.post("/add-supplier", urlencodedParser, (req, res) => {
    if(req.session.logged){
        let sql = "INSERT INTO suppliertable SET ?"
        let post = {
            employeeid: req.session.employeeid,
            suppliername: req.body.suppliername,
            suppliercity: req.body.suppliercity,
            supplierstreet: req.body.supplierstreet,
            supplierprovince: req.body.supplierprovince,
            supplierzipcode: req.body.supplierzipcode,
            suppliercontact: req.body.suppliercontact,
            supplieremail: req.body.supplieremail,
        }
        connection.query(sql, post, (err, res) => { 
            if(err){
                throw(err);
            }else{
                console.log("success");
                console.log(res);
            }
        });
        res.redirect("/suppliers");
    }
});
//UPDATE SUPPLIER
app.get("/suppliers/:supplierid/update-supplier", (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM suppliertable WHERE supplierid = '"+req.params.supplierid+"'", (err, response) => {
            if(err){
                throw(err);
            }else{
                console.log(response);
                res.render("update-supplier", {supplier: response[0], usertype: req.session.usertype});
            }
        });
    }
});
app.put("/suppliers/:supplierid", urlencodedParser, (req, res) => {
    if(req.session.logged){
        let sql = "UPDATE suppliertable SET ? WHERE supplierid = '"+req.params.supplierid+"'";
        let post = {
            employeeid: req.session.employeeid,
            suppliername: req.body.suppliername,
            suppliercity: req.body.suppliercity,
            supplierstreet: req.body.supplierstreet,
            supplierprovince: req.body.supplierprovince,
            supplierzipcode: req.body.supplierzipcode,
            suppliercontact: req.body.suppliercontact,
            supplieremail: req.body.supplieremail
        }
        connection.query(sql, post, (err, res) => { 
            if(err){
                throw(err);
            }else{
                console.log("success");
                console.log(res);
            }
        });
        res.redirect("/suppliers");
    }
});
//DELETE SUPPLIER
app.delete("/suppliers/:supplierid", (req, res) => {
    if(req.session.logged){
        connection.query("DELETE FROM suppliertable WHERE supplierid = '"+req.params.supplierid+"'", (err) => {
            if(err){
                throw(err);
            }else{
                res.redirect("/suppliers");
            }
        });
    }
});
//SUPPLY LOG
app.get("/supply-log", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT * FROM supplylogtable", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("supply-log", object);
            }
        });
    }
});
//ADD SUPPLY
app.get("/add-supply", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT * FROM suppliertable", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("add-supply", object);
            }
        });
    }
});
app.post("/add-supply", urlencodedParser, (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM employeetable WHERE employeeid = '"+req.session.employeeid+"'", (err) => {
            if(err){
                throw(err);
            }else{
                connection.query("SET FOREIGN_KEY_CHECKS=0;", (err) => {
                    if(err){
                        throw(err);
                    }else{
                        let sql1 = "INSERT INTO supplylogtable SET ?"
                        let post1 = {
                            employeeid: req.session.employeeid,
                            supplierid: req.body.supplierid,
                            itemid: req.body.itemid,
                            itemname: req.body.itemname,
                            stockadded: req.body.stockadded,
                            itemunit: req.body.itemunit
                        }
                        connection.query(sql1, post1, (err, res) => { 
                            if(err){
                                throw(err);
                            }else{
                                connection.query("SET FOREIGN_KEY_CHECKS=1;", (err) => {
                                    if(err){
                                        throw(err);
                                    }else{
                                        console.log("success");
                                        console.log(res);
                                    }
                                });
                            }
                        });
                    }
                });
                let sql2 = "INSERT INTO inventorytable SET ?"
                let post2 = {
                    itemid: req.body.itemid,
                    itemname: req.body.itemname,
                    itemstock: req.body.stockadded,
                    itemunit: req.body.itemunit
                }
                connection.query(sql2, post2, (err, res) => { 
                    if(err){
                        throw(err);
                    }else{
                        console.log("success");
                        console.log(res);
                    }
                });
            }
        });
        res.redirect("/supply-log");
    }
});
//UPDATE SUPPLY
app.get("/update-supply", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT * FROM suppliertable", (err, response) => {
            if(err){
                throw(err);
            }else{
                connection.query("SELECT * FROM inventorytable", (err, result) => {
                    if(err){
                        throw(err);
                    }else{
                        object = {post: response, display: result, usertype: req.session.usertype};
                        res.render("update-supply", object);
                    }
                });
            }
        });
    }
});
app.post("/update-supply", urlencodedParser, (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM employeetable WHERE employeeid = '"+req.session.employeeid+"'", (err) => {
            if(err){
                throw(err);
            }else{
                connection.query("SET FOREIGN_KEY_CHECKS=0;", (err) => {
                    if(err){
                        throw(err);
                    }else{
                        connection.query("SELECT * FROM inventorytable WHERE itemid = '"+req.body.itemid+"'", (err, result) => {
                            if(err){
                                throw(err);
                            }else{
                                let sql1 = "INSERT INTO supplylogtable SET ?"
                                let post1 = {
                                    employeeid: req.session.employeeid,
                                    supplierid: req.body.supplierid,
                                    itemid: req.body.itemid,
                                    itemname: result[0].itemname,
                                    stockadded: req.body.stockadded,
                                    itemunit: result[0].itemunit
                                }
                                connection.query(sql1, post1, (err, res) => { 
                                    if(err){
                                        throw(err);
                                    }else{
                                        connection.query("SET FOREIGN_KEY_CHECKS=1;", (err) => {
                                            if(err){
                                                throw(err);
                                            }else{
                                                console.log("success");
                                                console.log(res);
                                            }
                                        });
                                    }
                                });
                            }
                            let num1 = result[0].itemstock;
                            let num2 = req.body.stockadded;
                            let addstock = num1+(num2-0);
                            connection.query("UPDATE inventorytable SET itemstock = '"+addstock+"' WHERE itemid = '"+req.body.itemid+"'", (err) => {
                                if(err){
                                    throw(err);
                                }
                            });
                        });
                    }
                });
            }
        });
        res.redirect("/supply-log");
    }
});
//VOID SUPPLY LOG
app.put("/supply-log/:supplylogid/:itemid/:stockadded", (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM inventorytable WHERE itemid = '"+req.params.itemid+"'", (err, response) => {
            if(err){
                throw(err);
            }else{
                let voidstock = (response[0].itemstock)-parseInt(req.params.stockadded);
                connection.query("UPDATE inventorytable SET itemstock = '"+voidstock+"' WHERE itemid = '"+req.params.itemid+"'", (err) => {
                    if(err){
                        throw(err);
                    }
                });
                connection.query("UPDATE supplylogtable SET void = 1 WHERE supplylogid = '"+req.params.supplylogid+"'", (err) => {
                    if(err){
                        throw(err);
                    }else{
                        console.log("success");
                    }
                });
            }
        });
        res.redirect("/inventory");
    }
});
//INVENTORY
app.get("/inventory", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT * FROM inventorytable", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("inventory", object);
            }
        });
    }
});
//ITEM LOG
app.get("/item-log", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT * FROM itemlogtable", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("item-log", object);
            }
        });
    }
});
//PULL ITEM
app.get("/pull-item", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT * FROM inventorytable", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("pull-item", object);
            }
        });
    }
});
app.post("/pull-item", urlencodedParser, (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM inventorytable WHERE itemid = '"+req.body.itemid+"'", (err, result) => {
            if(err){
                throw(err);
            }else{
                let sql1 = "INSERT INTO itemlogtable SET ?"
                let post1 = {
                    employeeid: req.session.employeeid,
                    itemid: req.body.itemid,
                    pulledstock: req.body.pulledstock
                }
                connection.query(sql1, post1, (err, res) => { 
                    if(err){
                        throw(err);
                    }else{
                        console.log("success");
                        console.log(res);
                    }
                });
                if(result[0].itemstock>=req.body.pulledstock){
                    let pullstock = (result[0].itemstock)-parseInt(req.body.pulledstock);
                    connection.query("UPDATE inventorytable SET itemstock = '"+pullstock+"' WHERE itemid = '"+req.body.itemid+"'", (err) => {
                        if(err){
                            throw(err);
                        }
                    });
                }
            }
        });
        res.redirect("/item-log");
    }
});
//VOID ITEM LOG
app.put("/item-log/:itemlogid/:itemid/:pulledstock", (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM inventorytable WHERE itemid = '"+req.params.itemid+"'", (err, response) => {
            if(err){
                throw(err);
            }else{
                let voidstock = (response[0].itemstock)+parseInt(req.params.pulledstock);
                connection.query("UPDATE inventorytable SET itemstock = '"+voidstock+"' WHERE itemid = '"+req.params.itemid+"'", (err) => {
                    if(err){
                        throw(err);
                    }
                });
                connection.query("UPDATE itemlogtable SET void = 1 WHERE itemlogid = '"+req.params.itemlogid+"'", (err) => {
                    if(err){
                        throw(err);
                    }else{
                        console.log("success");
                    }
                });
            }
        });
        res.redirect("/item-log");
    }
});
/*----------------------------------------------------------------------------------------------------*/
//PRODUCTS SECTION
app.get("/products", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT * FROM producttable", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("products", object);
            }
        });
    }
});
app.get("/products-unavailable", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT * FROM producttable", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("products-unavailable", object);
            }
        });
    }
});
//ADD PRODUCT
app.get("/add-product", (req, res) => {
    if(req.session.logged){
        res.render("add-product", {usertype: req.session.usertype});
    }
});
app.post("/add-product", urlencodedParser, (req, res) => {
    if(req.session.logged){
        let sql = "INSERT INTO producttable SET ?"
        let post = {
            employeeid: req.session.employeeid,
            productname: req.body.productname,productprice: req.body.productprice,
        }
        connection.query(sql, post, (err, res) => { 
            if(err){
                throw(err);
            }else{
                console.log("success");
                console.log(res);
            }
        });
        res.redirect("/products");
    }
});
//UPDATE PRODUCT
app.get("/products/:productid/update-product", (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM producttable WHERE productid = '"+req.params.productid+"'", (err, response) => {
            if(err){
                throw(err);
            }else{
                console.log(response);
                res.render("update-product", {product: response[0], usertype: req.session.usertype});
            }
        });
    }
});
app.get("/products-unavailable/:productid/update-product-unavailable", (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM producttable WHERE productid = '"+req.params.productid+"'", (err, response) => {
            if(err){
                throw(err);
            }else{
                console.log(response);
                res.render("update-product-unavailable", {product: response[0], usertype: req.session.usertype});
            }
        });
    }
});
app.put("/products/:productid", urlencodedParser, (req, res) => {
    if(req.session.logged){
        connection.query("UPDATE producttable SET productname = '"+req.body.productname+"', productprice = '"+req.body.productprice+"', productavailability = '"+req.body.productavailability+"' WHERE productid = ?", [req.params.productid], (err) => {
            if(err){
                throw(err);
            }else{
                res.redirect("/products");
            }
        });
    }
});
app.put("/products-unavailable/:productid", urlencodedParser, (req, res) => {
    if(req.session.logged){
        connection.query("UPDATE producttable SET productname = '"+req.body.productname+"', productprice = '"+req.body.productprice+"', productavailability = '"+req.body.productavailability+"' WHERE productid = ?", [req.params.productid], (err) => {
            if(err){
                throw(err);
            }else{
                res.redirect("/products-unavailable");
            }
        });
    }
});
/*----------------------------------------------------------------------------------------------------*/
//TRANSACTIONS SECTION
app.get("/transaction", (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM producttable", (err, response) => {
            if(err){
                throw(err);
            }else{         
                connection.query("SELECT SUM(ordertotalprice) AS total FROM ordertable WHERE DATE(logdate) = CURRENT_DATE AND customerid = '"+req.session.customerid+"'", (err, data) => {
                    if(err){
                        throw err;
                    }else{
                        // console.log(data[0].total);
                        res.render("transaction", {
                            data: data[0].total, 
                            prodid: 0, 
                            prodquant: 0, 
                            product: response, 
                            values: 0, 
                            usertype: req.session.usertype, 
                            employeeid: req.session.employeeid,
                            customerid: req.session.customerid});
                    }
                });
            }
        });
    }
});
app.post("/transaction", urlencodedParser, (req, res) => {
    if(req.session.logged){
        connection.query("SELECT * FROM producttable WHERE productid = '"+req.body.prodid+"'", (err, response) => {
            if(err){
                throw(err);
            }
            connection.query("SELECT SUM(ordertotalprice) AS total FROM ordertable WHERE DATE(logdate) = CURRENT_DATE AND customerid = '"+req.session.customerid+"'", (err, data) => {
                if(err){
                    throw(err);
                }
                // console.log(data[0].total);
                res.render("transaction", {
                    data: data[0].total, 
                    prodid: req.body.prodid, 
                    prodquant: 0, 
                    product: response, 
                    values: 0, 
                    usertype: req.session.usertype, 
                    employeeid: req.session.employeeid, 
                    customerid: req.session.customerid});
            });
        });
    }
});
app.post("/transaction/:prodid", urlencodedParser, (req, res) => {
    if(req.session.logged){
        let sql;
        let post = {};
        connection.query("SELECT * FROM producttable WHERE productid = '"+req.params.prodid+"'", (err, response) => {
            if(err){
                throw(err);
            }
            sql = "INSERT INTO ordertable SET ?";
            post = {
                employeeid: req.session.employeeid,
                orderid: req.session.orderid,
                customerid: req.session.customerid,
                productid: req.params.prodid,
                orderquantity: req.body.prodquant,
                ordertotalprice: (response[0].productprice)*req.body.prodquant,
            }
            connection.query(sql, post, (err, res) => { 
                if(err){
                    throw(err);
                }else{
                    console.log("success");         
                    console.log(res);
                }
            });
        });
        connection.query("SELECT * FROM producttable", (err, result) => {
            if(err){
                throw(err);
            }
            connection.query("SELECT * FROM ordertable WHERE DATE(logdate) = CURRENT_DATE AND customerid = '"+req.session.customerid+"'", (err, response) => {
                if(err){
                    throw(err);
                }
                connection.query("SELECT SUM(ordertotalprice) AS total FROM ordertable WHERE DATE(logdate) = CURRENT_DATE AND customerid = '"+req.session.customerid+"'", (err, data) => {
                    if(err){
                        throw(err);
                    }
                    // console.log(data[0].total);
                    res.render("transaction", {
                        data: data[0].total, 
                        prodid: 0, 
                        prodquant: 0, 
                        product: result, 
                        values: response, 
                        usertype: req.session.usertype, 
                        employeeid: req.session.employeeid, 
                        customerid: req.session.customerid});
                });
            });
        });
    }
});
app.delete("/transaction/:productid", (req, res) => {
    connection.query("DELETE FROM ordertable WHERE productid = '"+req.params.productid+"'", (err) => {
        if(err){
            throw(err);
        }else{
            res.redirect("/transaction");
        }
    });
});
//THANK YOU
app.get("/invoice", (req, res) => {
    if(req.session.logged){
        req.session.customerid = req.session.customerid + 1;
        req.session.orderid = req.session.orderid + 1;
        res.render("invoice");
    }
});
//SALES LOG

//DAILY SALES LOG
app.get("/saleslog-dailysales", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT DAYNAME(logdate) as dayname, DAY(logdate) as day, MONTHNAME(logdate) as month, YEAR(logdate) as year, DATE(logdate) as date, SUM(orderquantity) as totalsales, SUM(ordertotalprice) as totalrevenue FROM ordertable GROUP BY date ORDER BY date DESC", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("saleslog-dailysales", object);
            }
        });
    }
});
app.get("/saleslog-dailysales/:objyear/:objmonth/:objday/saleslog-daily-details", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT CONCAT(ordertable.productid, ' - ', producttable.productname) as product, SUM(ordertotalprice) AS subtotalprice, SUM(orderquantity) AS totalquantity FROM ordertable INNER JOIN producttable ON ordertable.productid=producttable.productid WHERE YEAR(logdate)  = '"+req.params.objyear+"' AND MONTHNAME(logdate) = '"+req.params.objmonth+"' AND DAY(logdate) = '"+req.params.objday+"' GROUP BY ordertable.productid", (err, response) => {
            if(err){
                throw(err);
            }else{
                connection.query("SELECT SUM(ordertotalprice) AS totalrevenue, DATE_FORMAT(logdate, '%M %d, %Y - %W') as date FROM ordertable WHERE YEAR(logdate)  = '"+req.params.objyear+"' AND MONTHNAME(logdate) = '"+req.params.objmonth+"' AND DAY(logdate) = '"+req.params.objday+"'", (err, data) => {
                    if(err){
                        throw(err);
                    }else{
                    object = {post: response, usertype: req.session.usertype, data: data};
                    res.render("saleslog-daily-details", object);
                    }
                });
            }
        });
    }
});
app.get("/saleslog-dailysales/:objyear/:objmonth/:objday/saleslog-daily-log", (req, res) => {
    if(req.session.logged){
        connection.query("SELECT orderid, employeeid, SUM(orderquantity) as orderquantity, SUM(ordertotalprice) as orderrevenue, DAY(logdate) as day, MONTHNAME(logdate) as month, YEAR(logdate) as year FROM ordertable WHERE YEAR(logdate)  = '"+req.params.objyear+"' AND MONTHNAME(logdate) = '"+req.params.objmonth+"' AND DAY(logdate) = '"+req.params.objday+"' GROUP BY orderid", (err, response) => {
            if(err){
                throw(err);
            }else{
                connection.query("SELECT SUM(orderquantity) as totalquantity, SUM(ordertotalprice) AS totalrevenue FROM ordertable WHERE YEAR(logdate)  = '"+req.params.objyear+"' AND MONTHNAME(logdate) = '"+req.params.objmonth+"' AND DAY(logdate) = '"+req.params.objday+"'", (err, data) => {
                    if(err){
                        throw(err);
                    }else{
                    object = {post: response, usertype: req.session.usertype, data: data};
                    res.render("saleslog-daily-log", object);
                    }
                });
            }
        });
    }
});
app.get("/saleslog-dailysales/:objyear/:objmonth/:objday/:orderid/saleslog-daily-order-details", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT orderid, CONCAT(ordertable.productid, ' - ', producttable.productname) as product, SUM(ordertotalprice) AS subtotalprice, SUM(orderquantity) AS totalquantity FROM ordertable INNER JOIN producttable ON ordertable.productid=producttable.productid WHERE YEAR(logdate)  = '"+req.params.objyear+"' AND MONTHNAME(logdate) = '"+req.params.objmonth+"' AND DAY(logdate) = '"+req.params.objday+"' AND orderid = '"+req.params.orderid+"' GROUP BY ordertable.productid", (err, response) => {
            if(err){
                throw(err);
            }else{
                connection.query("SELECT SUM(ordertotalprice) AS totalprice, DAY(logdate) as day, MONTHNAME(logdate) as month, YEAR(logdate) as year FROM ordertable WHERE YEAR(logdate)  = '"+req.params.objyear+"' AND MONTHNAME(logdate) = '"+req.params.objmonth+"' AND DAY(logdate) = '"+req.params.objday+"' AND orderid = '"+req.params.orderid+"'", (err, data) => {
                    if(err){
                        throw(err);
                    }else{
                    object = {post: response, usertype: req.session.usertype, data: data};
                    res.render("saleslog-daily-order-details", object);
                    }
                });
            }
        });
    }
});



//MONTHLY SALES LOG
app.get("/saleslog-monthlysales", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT MONTHNAME(logdate) as month, YEAR(logdate) as year, SUM(orderquantity) as totalsales, SUM(ordertotalprice) as totalrevenue FROM ordertable GROUP BY month, year ORDER BY month ASC, year DESC", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("saleslog-monthlysales", object);
            }
        });
    }
});
app.get("/saleslog-monthlysales/:objyear/:objmonth/saleslog-monthly-details", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT CONCAT(ordertable.productid, ' - ', producttable.productname) as product, SUM(ordertotalprice) as subtotalprice, SUM(orderquantity) as totalquantity FROM ordertable INNER JOIN producttable ON ordertable.productid=producttable.productid WHERE YEAR(logdate)  = '"+req.params.objyear+"' AND MONTHNAME(logdate) = '"+req.params.objmonth+"' GROUP BY ordertable.productid", (err, response) => {
            if(err){
                throw(err);
            }else{
                connection.query("SELECT SUM(ordertotalprice) as totalrevenue, DATE_FORMAT(logdate, '%M %Y') as date FROM ordertable WHERE YEAR(logdate)  = '"+req.params.objyear+"' AND MONTHNAME(logdate) = '"+req.params.objmonth+"'", (err, data) => {
                    if(err){
                        throw(err);
                    }else{
                    object = {post: response, usertype: req.session.usertype, data: data};
                    res.render("saleslog-monthly-details", object);
                    }
                });
            }
        });
    }
});
app.get("/saleslog-monthlysales/:objyear/:objmonth/saleslog-monthly-daily-log", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT DAYNAME(logdate) as dayname, DAY(logdate) as day, MONTHNAME(logdate) as month, YEAR(logdate) as year, DATE(logdate) as date, SUM(orderquantity) as totalsales, SUM(ordertotalprice) as totalrevenue FROM ordertable WHERE MONTHNAME(logdate) = '"+req.params.objmonth+"' AND YEAR(logdate) = '"+req.params.objyear+"' GROUP BY date ORDER BY date DESC", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("saleslog-monthly-daily-log", object);
            }
        });
    }
});
app.get("/saleslog-monthlysales/:objyear/:objmonth/saleslog-monthly-weekly-log", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT sum(orderquantity) as totalsales, sum(ordertotalprice) as totalrevenue, MONTHNAME(logdate) as month, YEAR(logdate) as year, DATE_FORMAT(DATE_ADD(logdate, INTERVAL (-WEEKDAY(logdate)) DAY), '%M %d, %Y') as WeekStart, DATE_FORMAT(DATE_ADD(logdate, INTERVAL (6-WEEKDAY(logdate)) DAY), '%M %d, %Y') as WeekEnd FROM ordertable WHERE MONTHNAME(logdate) = '"+req.params.objmonth+"' AND YEAR(logdate) = '"+req.params.objyear+"' GROUP BY WeekStart ORDER BY WEEK(logdate) DESC", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("saleslog-monthly-weekly-log", object);
            }
        });
    }
});
app.get("/saleslog-monthlysales/:objyear/:objmonth/:objstart-:objend/saleslog-weekly-log", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT sum(orderquantity) as totalsales, sum(ordertotalprice) as totalrevenue, MONTHNAME(logdate) as month, YEAR(logdate) as year, DAY(logdate) as day, DATE_FORMAT(logdate, '%M %d, %Y - %W') as date, DATE_FORMAT(str_to_date('"+req.params.objstart+"', '%M %d, %Y'), '%M %d, %Y') as WeekStart, DATE_FORMAT(str_to_date('"+req.params.objend+"', '%M %d, %Y'), '%M %d, %Y') as WeekEnd FROM ordertable WHERE  DATE(logdate) BETWEEN str_to_date('"+req.params.objstart+"', '%M %d, %Y') AND str_to_date('"+req.params.objend+"', '%M %d, %Y') AND MONTHNAME(logdate) = '"+req.params.objmonth+"' AND YEAR(logdate) = '"+req.params.objyear+"' GROUP BY date ORDER BY date DESC", (err, response) => {
            if(err){
                throw(err);
            }else{
                object = {post: response, usertype: req.session.usertype};
                res.render("saleslog-weekly-log", object);
            }
        });
    }
});
app.get("/saleslog-monthlysales/:objyear/:objmonth/:objstart-:objend/saleslog-weekly-details", (req, res) => {
    if(req.session.logged){
        let object = {};
        connection.query("SELECT CONCAT(ordertable.productid, ' - ', producttable.productname) as product, SUM(ordertotalprice) as subtotalprice, SUM(orderquantity) as totalquantity, MONTHNAME(logdate) as month, YEAR(logdate) as year FROM ordertable INNER JOIN producttable ON ordertable.productid=producttable.productid WHERE  DATE(logdate) BETWEEN str_to_date('"+req.params.objstart+"', '%M %d, %Y') AND str_to_date('"+req.params.objend+"', '%M %d, %Y') AND MONTHNAME(logdate) = '"+req.params.objmonth+"' AND YEAR(logdate) = '"+req.params.objyear+"' GROUP BY ordertable.productid", (err, response) => {
            if(err){
                throw(err);
            }else{
                connection.query("SELECT SUM(ordertotalprice) as totalrevenue, DATE_FORMAT(str_to_date('"+req.params.objstart+"', '%M %d, %Y'), '%M %d, %Y') as WeekStart, DATE_FORMAT(str_to_date('"+req.params.objend+"', '%M %d, %Y'), '%M %d, %Y') as WeekEnd FROM ordertable WHERE DATE(logdate) BETWEEN str_to_date('"+req.params.objstart+"', '%M %d, %Y') AND str_to_date('"+req.params.objend+"', '%M %d, %Y') AND MONTHNAME(logdate) = '"+req.params.objmonth+"' AND YEAR(logdate) = '"+req.params.objyear+"'", (err, data) => {
                    if(err){
                        throw(err);
                    }else{
                    object = {post: response, usertype: req.session.usertype, data: data};
                    res.render("saleslog-weekly-details", object);
                    }
                });
            }
        });
    }
});
/*----------------------------------------------------------------------------------------------------*/
app.listen(3000, () => {
    console.log("Server is running :: localhost:3000");
});