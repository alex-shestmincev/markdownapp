var should = require('chai').should(),
  expect = require('chai').expect,
  supertest = require('supertest'),
  api = supertest('http://localhost:3003');

var big_text = [
  "#PromisePipe - reusable promise chains",
  "PromisePipe allows to build a reusable Promise chain with custom *API*.",
  "Promise **pipe** returns a function which you can call multiple times and each time all chains will be called.",
  "##Link",
  "[github link](https://github.com/edjafarov)"
];

var big_html = [
  "<h1>PromisePipe - reusable promise chains</h1>",
  "<p>PromisePipe allows to build a reusable Promise chain with custom <em>API</em>.</p>",
  "<p>Promise <strong>pipe</strong> returns a function which you can call multiple times and each time all chains will be called.</p>",
  "<h2>Link</h2>",
  '<p><a href="https://github.com/edjafarov">github link</a></p>'
];
var id;

describe('User', function(){

  it('should return a 200 responce', function(done){
    api.get('/')
      .set('Accept', 'application/json')
      .expect(200,done);
  });

  it('should save text and parsed html to DB and return id',function(done){
    api.post('/markdown/save')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({
        text:big_text.join('\n')
      })
      .end(function(err, res){

        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal(1);
        id = res.body.id;
        expect(id.length).to.equal(24);
        done();
      });
  });

  it('should get text and parsed html by id',function(done){
    api.get('/markdown/get/'+id)
      .end(function(err, res){
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal(1);
        expect(res.body.text).to.equal(big_text.join('\n'));
        expect(res.body.html).to.equal(big_html.join(''));
        done();
      });
  });

  it('should fail to get text and parsed html by bad id',function(done){
    api.get('/markdown/get/'+123)
      .end(function(err, res){
        expect(res.body.statusCode).to.equal(404);
        expect(res.body.message).to.equal("Bad id");
        done();
      });
  });

  it('should fail to get text and parsed html by wrong id',function(done){
    api.get('/markdown/get/'+'554293eb6104b56b4448ea12')
      .end(function(err, res){
        expect(res.body.statusCode).to.equal(404);
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal("Cannot find html by id");
        done();
      });
  });

  it('should not save empty post data',function(done){
    api.post('/markdown/save')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({
        //empty
      })
      .end(function(err, res){
        expect(res.body.statusCode).to.equal(404);
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal("Empty post data");
        done();
      });
  });

  it('should not save empty post data',function(done){
    api.post('/markdown/save')
      .set('Accept', 'application/x-www-form-urlencoded')
      .send({
        text:''
      })
      .end(function(err, res){

        expect(res.body.statusCode).to.equal(404);
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal("Empty post data");
        done();
      });
  });

});