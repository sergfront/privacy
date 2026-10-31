// Serves the static site from site/ and sends www.totefile.com to totefile.com.
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.hostname === 'www.totefile.com') {
      url.hostname = 'totefile.com';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(req);
  },
};
