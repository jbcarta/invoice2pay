// Local
mongoose.connect('mongodb://127.0.0.1:27017/casupo');
//mongoose.connect('mongodb://localhost:27017/shopping');
//mongoose.connect('mongodb://testuser:20160707@ds017175.mlab.com:17175/shopping');

fs.readFile('./people.json', 'utf8', function (err,data) {
  data = JSON.parse(data); // you missed that...
  for(var i = 0; i < data.length; i++) {
    var newPerson = new Person();
    newPerson.firstname = data[i].firstname;
    newPerson.lastname = data[i].lastname;
    newPerson.age = data[i].age;
    newPerson.save(function (err) {});
  }
});