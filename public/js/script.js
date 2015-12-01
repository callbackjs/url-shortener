var ul = document.getElementsByTagName('ul')[0];
var topBar = document.getElementById('top-bar');

/* Displays a short link when a code is clicked. */
ul.addEventListener('click', function(event) {
  // if code is clicked, display short link in the top bar
  if (event.target.nodeName === 'A') {
    var codeLink = event.target;
    topBar.textContent = 'Short link: ' + codeLink.href;
    event.preventDefault();
  }
});

/* Renders the initial codes. */
var request = new XMLHttpRequest();
request.addEventListener('load', function() {
  if (request.status === 200) {
    var shortCodes = JSON.parse(request.responseText);
    ul.innerHTML = renderShortCodes(shortCodes).innerHTML;
  }
});

request.open('GET', '/short-codes', true);
request.send();

/* Adds a new code. */
var addShortCodeForm = document.getElementById('add-short-code-form');
addShortCodeForm.addEventListener('submit', function(event) {
  event.preventDefault();

  var url = addShortCodeForm.url.value;
  if (!url) {
    return;
  }

  var request = new XMLHttpRequest();
  request.addEventListener('load', function() {
    if (request.status === 200) {
      var shortCodes = JSON.parse(request.responseText);
      ul.innerHTML = renderShortCodes(shortCodes).innerHTML;
    }
  });

  request.open('POST', '/short-codes', true);
  request.setRequestHeader('Content-type', 'application/json');
  request.send(JSON.stringify({ url: url }));
});

/* Renders a comment with the given name and message to be listed in the
 * #comments div. */
function renderShortCodes(shortCodes) {
  var header = tag('li', [
    tag('strong', { 'class': 'url' }, 'URL'),
    tag('strong', { 'class': 'code' }, 'Code')
  ]);

  var lis = shortCodes.map(function(code) {
    return tag('li', [
      tag('span', { 'class': 'url' }, code.url),
      tag('a', { href: '/expand/?code=' + code.code, 'class': 'code' }, code.code)
    ]);
  });

  lis.unshift(header);
  return tag('ul', lis);
}

/* Creates and returns an HTMLElement representing a tag of the given name.
 * attrs is an object, where the key-value pairs represent HTML attributes to
 * set on the tag. contents is an array of strings/HTMLElements (or just a single
 * string/HTMLElement) that will be contained within the tag.
 *
 * Note that attrs is an optional parameter, and can be ommitted.
 *
 * Examples:
 * tag('p', 'A simple paragraph') => <p>A simple paragraph</p>
 * tag('a', {href: '/about'}, 'About') => <a href="/about">About</a>
 *
 * tag('ul', tag('li', 'First item')) => <ul><li>First item</li></ul>
 *
 * tag('div', [
 *   tag('h1', {'class': 'headline'}, 'JavaScript'),
 *   ' is awesome, ',
 *   tag('span', "especially in CS42.")
 * ])
 * => <div>
 *      <h1 class="headline">JavaScript</h1>
 *      is awesome,
 *      <span>especially in CS42.</span>
 *    </div>
 */
function tag(name, attrs, contents) {
  // attrs is optional
  if (!contents) {
    contents = attrs;
    attrs = [];
  }

  var element = document.createElement(name);
  for (var attr in attrs) {
    element.setAttribute(attr, attrs[attr]);
  }

  // If contents is a single string or HTMLElement, make it an array of one
  // element; this guarantees that contents is an array below.
  if (!(contents instanceof Array)) {
    contents = [contents];
  }

  contents.forEach(function(piece) {
    if (piece instanceof HTMLElement) {
      element.appendChild(piece);
    } else {
      // must create a text node for a raw string
      element.appendChild(document.createTextNode(piece));
    }
  });

  return element;
}
