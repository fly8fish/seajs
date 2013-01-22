define(function(require) {

  var test = require('../test')
  var assert = test.assert

  var util = seajs.test


  assert(util.dirname('./a/b/c.js') === './a/b/', 'dirname')
  assert(util.dirname('a/b/c.js') === 'a/b/', 'dirname')
  assert(util.dirname('/a/b/c.js') === '/a/b/', 'dirname')
  assert(util.dirname('d.js') === './', 'dirname')
  assert(util.dirname('') === './', 'dirname')
  assert(util.dirname('xxx') === './', 'dirname')
  assert(util.dirname('http://cdn.com/js/file.js') === 'http://cdn.com/js/', 'dirname')
  assert(util.dirname('http://cdn.com/js/file.js?t=xxx') === 'http://cdn.com/js/', 'dirname')
  assert(util.dirname('http://example.com/arale/seajs/1.2.0/??sea.js,plugin-combo.js') === 'http://example.com/arale/seajs/1.2.0/', 'dirname')
  assert(util.dirname('http://cdn.com/??seajs/1.2.0/sea.js,jquery/1.7.2/jquery.js') === 'http://cdn.com/', 'dirname')


  assert(util.realpath('http://test.com/./a//b/../c') === 'http://test.com/a/c', 'realpath')
  assert(util.realpath('https://test.com/a/b/../../c') === 'https://test.com/c', 'realpath')
  assert(util.realpath('file:///a//b/c') === 'file:///a/b/c', 'realpath')
  assert(util.realpath('http://a//b/c') === 'http://a/b/c', 'realpath')


  assert(util.normalize('a/b/c') === 'a/b/c.js', 'normalize')
  assert(util.normalize('a/b/c.js') === 'a/b/c.js', 'normalize')
  assert(util.normalize('a/b/c.css') === 'a/b/c.css', 'normalize')
  assert(util.normalize('a/b/c.d') === 'a/b/c.d.js', 'normalize')
  assert(util.normalize('a/b/c.json#') === 'a/b/c.json', 'normalize')
  assert(util.normalize('c?t=20110525') === 'c?t=20110525', 'normalize')
  assert(util.normalize('c?t=20110525#') === 'c?t=20110525', 'normalize')
  assert(util.normalize('a/b/') === 'a/b/', 'normalize')


  seajs.config({
        alias: {
          'jquery-debug': 'jquery/1.8.0/jquery-debug',
          'app': 'app/1.2/app',
          'biz/a': 'path/to/biz/a.js',
          './b': 'path/to/b.js',
          '/c': 'c.js',
          'http://test.com/router': 'router.js?t=20110525'
        }
      })

  assert(util.parseAlias('jquery-debug') === 'jquery/1.8.0/jquery-debug', 'parseAlias')
  assert(util.parseAlias('app') === 'app/1.2/app', 'parseAlias')
  assert(util.parseAlias('biz/a') === 'path/to/biz/a.js', 'parseAlias')
  assert(util.parseAlias('./b') === './b', 'parseAlias')
  assert(util.parseAlias('/c') === '/c', 'parseAlias')
  assert(util.parseAlias('http://test.com/router') === 'http://test.com/router', 'parseAlias')


  seajs.config({
    vars: {
      'locale': 'zh-cn',
      'biz': 'path/to/biz',
      'xx': './xx',
      'zz': 'zz.js',
      'a/b': 'path/to/a/b.js',
      'c': '{path}/to/c.js'
    }
  })

  assert(util.parseVars('./i18n/{locale}.js') === './i18n/zh-cn.js', 'parseVars')
  assert(util.parseVars('{biz}/js/x') === 'path/to/biz/js/x', 'parseVars')
  assert(util.parseVars('/js/{xx}/c.js') === '/js/./xx/c.js', 'parseVars')
  assert(util.parseVars('/js/{xx}/{zz}') === '/js/./xx/zz.js', 'parseVars')
  assert(util.parseVars('{a/b}') === 'path/to/a/b.js', 'parseVars')
  assert(util.parseVars('{not-existed}') === '{not-existed}', 'parseVars')
  assert(util.parseVars('{c}') === '{path}/to/c.js', 'parseVars')


  var pageDir = util.dirname(util.pageUri)
  var loaderDir = util.dirname(util.loaderUri)

  assert(util.addBase('http://a.com/b.js') === 'http://a.com/b.js', 'addBase')
  assert(util.addBase('./a.js', 'http://test.com/path/b.js') === 'http://test.com/path/a.js', 'addBase')
  assert(util.addBase('/b.js', 'http://test.com/path/to/c.js') === 'http://test.com/b.js', 'addBase')
  assert(util.addBase('c', 'http://test.com/path/to/c.js') === loaderDir + 'c', 'addBase')


  seajs.config({
    map: [
      ['aa.js', 'aa-debug.js'],
      [/^jquery\/.*/, 'http://localhost/jquery.js'],
      [/^(.*)\/js\/(.*)$/, function(m, m1, m2) {
        return m1 + '/script/' + m2
      }],
      function(uri) {
        if (uri.indexOf('/function/') > -1) {
          return 'http://test.com/path/to/function.js'
        }
      },
      ['cc.js', './cc.js']
    ]
  })

  assert(util.parseMap('path/to/aa.js') === 'path/to/aa-debug.js', 'parseMap')
  assert(util.parseMap('jquery/2.0.0/jquery') === 'http://localhost/jquery.js', 'parseMap')
  assert(util.parseMap('jquery/2.0.0/jquery-debug') === 'http://localhost/jquery.js', 'parseMap')
  assert(util.parseMap('path/to/js/a') === 'path/to/script/a', 'parseMap')
  assert(util.parseMap('path/to/function/b') === 'http://test.com/path/to/function.js', 'parseMap')
  assert(util.parseMap('cc.js') === './cc.js', 'parseMap')


  assert(util.id2Uri('path/to/a') === loaderDir + 'path/to/a.js', 'id2Uri')
  assert(util.id2Uri('path/to/a.js') === loaderDir + 'path/to/a.js', 'id2Uri')
  assert(util.id2Uri('path/to/a.js#') === loaderDir + 'path/to/a.js', 'id2Uri')
  assert(util.id2Uri('path/to/z.js?t=1234') === loaderDir + 'path/to/z.js?t=1234', 'id2Uri')
  assert(util.id2Uri('path/to/z?t=1234') === loaderDir + 'path/to/z?t=1234', 'id2Uri')
  assert(util.id2Uri('./b', 'http://test.com/path//to/x.js') === 'http://test.com/path/to/b.js', 'id2Uri')
  assert(util.id2Uri('/c', 'http://test.com/path/x.js') === 'http://test.com/c.js', 'id2Uri')
  assert(util.id2Uri('http://test.com/x.js') === 'http://test.com/x.js', 'id2Uri')
  assert(util.id2Uri('http://test.com/x.js#') === 'http://test.com/x.js', 'id2Uri')
  assert(util.id2Uri('./z.js', 'http://test.com/x.js') === 'http://test.com/z.js', 'id2Uri')
  assert(util.id2Uri('') === '', 'id2Uri')
  assert(util.id2Uri() === '', 'id2Uri')
  assert(util.id2Uri('http://XXX.com.cn/min/index.php?g=commonCss.css') === 'http://XXX.com.cn/min/index.php?g=commonCss.css', 'id2Uri')
  assert(util.id2Uri('./front/jquery.x.queue.js#') === pageDir + 'front/jquery.x.queue.js', 'id2Uri')


  test.done()

});

