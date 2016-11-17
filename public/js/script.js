const ul = document.getElementsByTagName('ul')[0]
const topBar = document.getElementById('top-bar')

/* Displays a short link when a code is clicked. */
ul.addEventListener('click', event => {
  // if code is clicked, display short link in the top bar
  if (event.target.nodeName === 'A') {
    const codeLink = event.target
    topBar.textContent = 'Short link: ' + codeLink.href
    event.preventDefault()
  }
})

/* Renders the initial codes. */
const request = new XMLHttpRequest()
request.addEventListener('load', () => {
  if (request.status === 200) {
    const shortCodes = JSON.parse(request.responseText)
    ul.innerHTML = renderShortCodes(shortCodes).innerHTML
  }
})

request.open('GET', '/short-codes', true)
request.send()

/* Adds a new code. */
const addShortCodeForm = document.getElementById('add-short-code-form')
addShortCodeForm.addEventListener('submit', event => {
  event.preventDefault()

  const url = addShortCodeForm.url.value
  if (!url) {
    return
  }

  const request = new XMLHttpRequest()
  request.addEventListener('load', () => {
    if (request.status === 200) {
      const shortCodes = JSON.parse(request.responseText)
      ul.innerHTML = renderShortCodes(shortCodes).innerHTML
    }
  })

  request.open('POST', '/short-codes', true)
  request.setRequestHeader('Content-type', 'application/json')
  request.send(JSON.stringify({ url: url }))
})

/* Renders all the given short codes into a <ul>, returning a HTMLElement. */
function renderShortCodes(shortCodes) {
  const header = tag('li', {}, [
    tag('strong', { 'class': 'url' }, 'URL'),
    tag('strong', { 'class': 'code' }, 'Code')
  ])

  const lis = shortCodes.map(code => {
    return tag('li', {}, [
      tag('span', { 'class': 'url' }, code.url),
      tag('a', { href: '/expand/?code=' + code.code, 'class': 'code' }, code.code)
    ])
  })

  lis.unshift(header)
  return tag('ul', {}, lis)
}

/* Creates and returns an HTMLElement representing a tag of the given name.
 * attrs is an object, where the key-value pairs represent HTML attributes to
 * set on the tag. contents is an array of strings/HTMLElements (or just
 * a single string/HTMLElement) that will be contained within the tag.
 *
 * Examples:
 * tag('p', {}, 'A simple paragraph') => <p>A simple paragraph</p>
 * tag('a', {href: '/about'}, 'About') => <a href="/about">About</a>
 *
 * tag('ul', {}, tag('li', {}, 'First item')) => <ul><li>First item</li></ul>
 *
 * tag('div', {}, [
 *   tag('h1', {'class': 'headline'}, 'JavaScript'),
 *   ' is awesome, ',
 *   tag('span', {}, 'especially in CS42.')
 * ])
 * => <div>
 *      <h1 class="headline">JavaScript</h1>
 *      is awesome,
 *      <span>especially in CS42.</span>
 *    </div>
 */
function tag(name, attrs, contents) {
  const element = document.createElement(name)
  for (const attrName in attrs) {
    element.setAttribute(attrName, attrs[attrName])
  }

  // If contents is a single string or HTMLElement, make it an array of one
  // element; this guarantees that contents is an array below.
  if (!(contents instanceof Array)) {
    contents = [contents]
  }

  contents.forEach(piece => {
    if (piece instanceof HTMLElement) {
      element.appendChild(piece)
    } else {
      // must create a text node for a raw string
      element.appendChild(document.createTextNode(piece))
    }
  })

  return element
}
