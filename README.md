# SPA Hosting Server with Back-end API proxy

This project demonstrates how to setup a small `express` server such that:

 1. All requests to `/app` will serve static assets from the folder `./public` (which mirrors a minified real-life React SPA)
 2. Any requests to `/app/<some>/<path>` that cannot be resolved to a static file will by default return `index.html`, which makes it compatible with client side routing libraries like `React Router`. See more [here](https://create-react-app.dev/docs/deployment) from the creators of `create-react-app`
 3. Any requests to `/api` will be proxied to some other back-end API server for processing. So a request to `http://localhost:3000/api/users/1` will be proxied to `https://reqres.in/api/users/1`

## Why?

 1. Assuming the back-end server requires JWT token for authentication. Further, assume we do not want to store 
the JWT token on the user's browser (for fear of XSS attacks). This approach allows our express server (which is technically a back-end server) to manage `OAuth` flows and use encrypted HttpOnly cookies. Learn more about cookies and the various attributes you can add to cookies [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
 2. As a colloray - since this express server is a back-end server (and its environment variables aren't visible to the browser) we can safely pass OAuth 2 `clientSecret` and complete the Authorization Code flow or any other flows that requires the aforementioend `clientSecret`
 3. Completely get rid of CORS issues

## How to test it out?

```shell
npm install
node server.js

# try it out on your browser by going to localhost:3000/app

# try to hit the api routes:
curl http://localhost:3000/api/users/1
```
