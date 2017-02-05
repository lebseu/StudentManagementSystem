var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var filename = '../students.xml';
var filepath = path.normalize(path.join(__dirname, filename));
var xml2js = require('xml2js');

router.post('/', function (req, res, next) {
    var dataJs={};
    var dataXml='';
    var name = req.body.name;
    var id = req.body.id;
    var nationality = req.body.nationality;
    var newStudent = {name: name, id : id, nationality : nationality};
    var students = {students:[]};
    xmlFileToJs(function (err, dataJs) {
        if (err) console.log(err);
        dataJs['students']['student'].push(newStudent);
        jsToXmlFile(dataJs, function (err) {
            if (err) console.log(err);
            dataXml = fs.readFileSync(filepath, 'utf8');
            res.render('students', {dataXml: dataXml, dataJs: dataJs});
        })
    });
});

function xmlFileToJs(cb) {

    fs.readFile(filepath, 'utf8', function (err, xmlStr) {
        if (err) console.log(err);
        xml2js.parseString(xmlStr, {}, cb);
    });
}

function jsToXmlFile(obj, cb) {
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    fs.writeFile(filepath, xml, cb);
}
module.exports = router;
