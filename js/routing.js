export class Router {
    constructor() {
        this.routes = [];
        this.links = [];

        window.addEventListener('popstate', this.handle.bind(this));
    }

    async handle() {
        const url = window.location.pathname;

        let handled = false;
        for (let route of this.routes) {
            const isHandled = await route(url);
            if (isHandled) {
                handled = true;
            }
        }
        for (let { element, className } of this.links) {
            if (navMatch(window.location.href, element.href)) {
                element.classList.add(className);
            } else {
                element.classList.remove(className);
            }
        }
        return handled;
    }

    /**
     * @param {string} pattern URL match pattern
     * @param {(params) => Promise} handler Route handler
     */
    registerRoute(pattern, handler) {
        this.routes.push(async url => {
            let params = extractMatch(url, pattern);
            if (params !== null) {
                await handler(params);
                return true;
            } else {
                return false;
            }
        });
    }

    /**
     * @param {string} pattern URL match pattern
     * @param {(params) => Promise} handler Route handler
     */
    get(pattern, handler) {
        this.registerRoute(pattern, handler);
    }

    /**
     * Attach anchor event listeners
     * @param {HTMLAnchorElement} element Anchor node
     * @param {(params) => Promise} handler Route handler
     */
    link(element, navClassName) {
        element.addEventListener('click', (ev) => {
            ev.preventDefault();
            window.history.pushState({}, document.title, ev.target.href);
            this.handle();
        });

        if (navClassName !== undefined) {
            this.links.push({ element, className: navClassName });
        }

        return element;
    }
}


export function extractMatch(url, pattern) {
    const tokens = url.split('/').filter(t => t.length > 0);
    const patternTokens = pattern.split('/').filter(t => t.length > 0);

    if (tokens.length == patternTokens.length) {
        let result = {};
        for (let i = 0; i < tokens.length; i++) {
            if (patternTokens[i][0] === '{') {
                const name = patternTokens[i].slice(1, -1);
                result[name] = tokens[i];
            } else if (tokens[i] != patternTokens[i]) {
                result = null;
                break;
            }
        }
        return result;
    } else {
        return null;
    }
}

function navMatch(url, href) {
    const tokens = url.split('/').filter(t => t.length > 0);
    const hrefTokens = href.split('/').filter(t => t.length > 0);

    if (tokens.length >= hrefTokens.length) {
        for (let i = 0; i < hrefTokens.length; i++) {
            if (tokens[i] != hrefTokens[i]) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}