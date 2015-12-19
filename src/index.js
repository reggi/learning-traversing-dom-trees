import assert from 'assert'
import {env as jsdom} from 'jsdom'
import {readFile} from 'fs'
import {promisify} from 'bluebird'
let readFileAsync = promisify(readFile)
let jsdomAsync = promisify(jsdom)

async function main() {
  let starWarsHTML = await readFileAsync('./star-wars.html', 'utf8')
  let starTrekHTML = await readFileAsync('./star-trek.html', 'utf8')
  let starWarsDOM = await jsdomAsync(starWarsHTML)
  let starTrekDOM = await jsdomAsync(starTrekHTML)
  let starWarsDoc = starWarsDOM.document
  let starTrekDoc = starTrekDOM.document
  assert.equal(getNodeIndex(starWarsDoc.querySelector('#jedi'), starWarsDoc.querySelector('#luke')), 0)
  assert.equal(getNodeIndex(starWarsDoc.querySelector('#jedi'), starWarsDoc.querySelector('#yoda')), 1)
  assert.equal(getNodeFromIndex(starWarsDoc.querySelector('#jedi'), 0), starWarsDoc.querySelector('#luke'))
  assert.equal(getNodeFromIndex(starWarsDoc.querySelector('#jedi'), 1), starWarsDoc.querySelector('#yoda'))
  assert.deepEqual(getNodePosition(starWarsDoc.querySelector('#luke')), [0, 1, 0, 0, 0])
  assert.deepEqual(getNodePosition(starWarsDoc.querySelector('#yoda')), [0, 1, 0, 0, 1])
  assert.deepEqual(getNodePosition(starWarsDoc.querySelector('#jedi')), [0, 1, 0, 0])
  assert.deepEqual(getNodePosition(starWarsDoc.querySelector('#vader')), [0, 1, 0, 1, 0])
  assert.deepEqual(getNodePosition(starWarsDoc.querySelector('#sidious')), [0, 1, 0, 1, 1])
  assert.deepEqual(getNodePosition(starWarsDoc.querySelector('#sith')), [0, 1, 0, 1])
  assert.deepEqual(getNodePosition(starWarsDoc.querySelector('#star-wars')), [0, 1, 0])
  assert.deepEqual(getNodePosition(starWarsDoc.querySelector('body')), [0, 1])
  assert.equal(getNodeFromPosition(starWarsDoc, [0, 1, 0, 0, 0]).id, 'luke')
  assert.equal(getNodeFromPosition(starWarsDoc, [0, 1, 0, 0, 1]).id, 'yoda')
  assert.equal(getNodeInClone(starTrekDoc, starWarsDoc.querySelector('#luke')).id, 'picard')
  assert.equal(getNodeInClone(starTrekDoc, starWarsDoc.querySelector('#yoda')).id, 'janeway')
  assert.equal(getNodeInClone(starWarsDoc, starTrekDoc.querySelector('#borg')).id, 'vader')
  assert.equal(getNodeInClone(starWarsDoc, starTrekDoc.querySelector('#khan')).id, 'sidious')
  assert.equal(getNodeInClone(starTrekDoc, starWarsDoc.querySelector('#vader')).id, 'borg')
}

function getNodeFromIndex($parent, index) {
  if (!$parent || !$parent.hasChildNodes()) return $parent
  let $childNodes = Array.from($parent.children)
  return $childNodes[index]
}

function getNodeFromPosition($tree, position) {
  let $node = $tree
  position.forEach(index => {
    $node = getNodeFromIndex($node, index)
  })
  return $node
}

function getNodeIndex($parent, $node) {
  if (!$parent || !$parent.hasChildNodes()) return null
  let result = false
  let $childNodes = Array.from($parent.children)
  $childNodes.forEach(($child, index) => {
    if ($child === $node) result = index
  })
  return result
}

function getNodePosition($node) {
  let pathToNode = []
  function _findNode($node) {
    if (!$node || !$node.parentNode) return false
    let $parent = $node.parentNode
    let i = getNodeIndex($parent, $node)
    pathToNode.push(i)
    _findNode($parent)
  }
  _findNode($node)
  return pathToNode.reverse()
}

function getNodeInClone($findNodeInTree, $node) {
  let position = getNodePosition($node)
  return getNodeFromPosition($findNodeInTree, position)
}

main().catch(console.error)
