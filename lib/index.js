'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _jsdom = require('jsdom');

var _fs = require('fs');

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFileAsync = (0, _bluebird.promisify)(_fs.readFile);
var jsdomAsync = (0, _bluebird.promisify)(_jsdom.env);

function main() {
  var starWarsHTML, starTrekHTML, starWarsDOM, starTrekDOM, starWarsDoc, starTrekDoc;
  return regeneratorRuntime.async(function main$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return regeneratorRuntime.awrap(readFileAsync('./star-wars.html', 'utf8'));

      case 2:
        starWarsHTML = _context.sent;
        _context.next = 5;
        return regeneratorRuntime.awrap(readFileAsync('./star-trek.html', 'utf8'));

      case 5:
        starTrekHTML = _context.sent;
        _context.next = 8;
        return regeneratorRuntime.awrap(jsdomAsync(starWarsHTML));

      case 8:
        starWarsDOM = _context.sent;
        _context.next = 11;
        return regeneratorRuntime.awrap(jsdomAsync(starTrekHTML));

      case 11:
        starTrekDOM = _context.sent;
        starWarsDoc = starWarsDOM.document;
        starTrekDoc = starTrekDOM.document;

        _assert2.default.equal(getNodeIndex(starWarsDoc.querySelector('#jedi'), starWarsDoc.querySelector('#luke')), 0);
        _assert2.default.equal(getNodeIndex(starWarsDoc.querySelector('#jedi'), starWarsDoc.querySelector('#yoda')), 1);
        _assert2.default.equal(getNodeFromIndex(starWarsDoc.querySelector('#jedi'), 0), starWarsDoc.querySelector('#luke'));
        _assert2.default.equal(getNodeFromIndex(starWarsDoc.querySelector('#jedi'), 1), starWarsDoc.querySelector('#yoda'));
        _assert2.default.deepEqual(getNodePosition(starWarsDoc.querySelector('#luke')), [0, 1, 0, 0, 0]);
        _assert2.default.deepEqual(getNodePosition(starWarsDoc.querySelector('#yoda')), [0, 1, 0, 0, 1]);
        _assert2.default.deepEqual(getNodePosition(starWarsDoc.querySelector('#jedi')), [0, 1, 0, 0]);
        _assert2.default.deepEqual(getNodePosition(starWarsDoc.querySelector('#vader')), [0, 1, 0, 1, 0]);
        _assert2.default.deepEqual(getNodePosition(starWarsDoc.querySelector('#sidious')), [0, 1, 0, 1, 1]);
        _assert2.default.deepEqual(getNodePosition(starWarsDoc.querySelector('#sith')), [0, 1, 0, 1]);
        _assert2.default.deepEqual(getNodePosition(starWarsDoc.querySelector('#star-wars')), [0, 1, 0]);
        _assert2.default.deepEqual(getNodePosition(starWarsDoc.querySelector('body')), [0, 1]);
        _assert2.default.equal(getNodeFromPosition(starWarsDoc, [0, 1, 0, 0, 0]).id, 'luke');
        _assert2.default.equal(getNodeFromPosition(starWarsDoc, [0, 1, 0, 0, 1]).id, 'yoda');
        _assert2.default.equal(getNodeInClone(starTrekDoc, starWarsDoc.querySelector('#luke')).id, 'picard');
        _assert2.default.equal(getNodeInClone(starTrekDoc, starWarsDoc.querySelector('#yoda')).id, 'janeway');
        _assert2.default.equal(getNodeInClone(starWarsDoc, starTrekDoc.querySelector('#borg')).id, 'vader');
        _assert2.default.equal(getNodeInClone(starWarsDoc, starTrekDoc.querySelector('#khan')).id, 'sidious');
        _assert2.default.equal(getNodeInClone(starTrekDoc, starWarsDoc.querySelector('#vader')).id, 'borg');

      case 33:
      case 'end':
        return _context.stop();
    }
  }, null, this);
}

function getNodeFromIndex($parent, index) {
  if (!$parent || !$parent.hasChildNodes()) return $parent;
  var $childNodes = Array.from($parent.children);
  return $childNodes[index];
}

function getNodeFromPosition($tree, position) {
  var $node = $tree;
  position.forEach(function (index) {
    $node = getNodeFromIndex($node, index);
  });
  return $node;
}

function getNodeIndex($parent, $node) {
  if (!$parent || !$parent.hasChildNodes()) return null;
  var result = false;
  var $childNodes = Array.from($parent.children);
  $childNodes.forEach(function ($child, index) {
    if ($child === $node) result = index;
  });
  return result;
}

function getNodePosition($node) {
  var pathToNode = [];
  function _findNode($node) {
    if (!$node || !$node.parentNode) return false;
    var $parent = $node.parentNode;
    var i = getNodeIndex($parent, $node);
    pathToNode.push(i);
    _findNode($parent);
  }
  _findNode($node);
  return pathToNode.reverse();
}

function getNodeInClone($findNodeInTree, $node) {
  var position = getNodePosition($node);
  return getNodeFromPosition($findNodeInTree, position);
}

main().catch(console.error);