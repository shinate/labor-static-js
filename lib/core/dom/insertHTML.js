/**
 * insert html
 * @id insertHTML
 *
 * @param {HTML Element} node
 * @param {String} target
 * @param {String} where beforebegin/afterbegin/beforeend/afterend
 *
 * @example
 * insertHTML(node,'<div></div>','beforebegin');
 * insertHTML(node,'<div></div>','AfterBegin');
 * insertHTML(node,'<div></div>','BeforeEnd');
 * insertHTML(node,'<div></div>','AfterEnd');
 */
module.exports = function(node, html, where) {

	node = ( typeof node === 'string' ? document.getElementById(node) : node) || document.body;
	where = where ? where.toLowerCase() : "beforeend";
	if (node.insertAdjacentHTML) {
		switch (where) {
		case "beforebegin":
			node.insertAdjacentHTML('BeforeBegin', html);
			return node.previousSibling;
		case "afterbegin":
			node.insertAdjacentHTML('AfterBegin', html);
			return node.firstChild;
		case "beforeend":
			node.insertAdjacentHTML('BeforeEnd', html);
			return node.lastChild;
		case "afterend":
			node.insertAdjacentHTML('AfterEnd', html);
			return node.nextSibling;
		}
		throw 'Illegal insertion point -> "' + where + '"';
	} else {
		var range = node.ownerDocument.createRange();
		var frag;
		switch (where) {
		case "beforebegin":
			range.setStartBefore(node);
			frag = range.createContextualFragment(html);
			node.parentNode.insertBefore(frag, node);
			return node.previousSibling;
		case "afterbegin":
			if (node.firstChild) {
				range.setStartBefore(node.firstChild);
				frag = range.createContextualFragment(html);
				node.insertBefore(frag, node.firstChild);
				return node.firstChild;
			} else {
				node.innerHTML = html;
				return node.firstChild;
			}
			break;
		case "beforeend":
			if (node.lastChild) {
				range.setStartAfter(node.lastChild);
				frag = range.createContextualFragment(html);
				node.appendChild(frag);
				return node.lastChild;
			} else {
				node.innerHTML = html;
				return node.lastChild;
			}
			break;
		case "afterend":
			range.setStartAfter(node);
			frag = range.createContextualFragment(html);
			node.parentNode.insertBefore(frag, node.nextSibling);
			return node.nextSibling;
		}
		throw 'Illegal insertion point -> "' + where + '"';
	}
};
