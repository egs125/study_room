// PRODUCTION --> It's from webpack config(webpack.DefinePlugin)
if (!('__contextPath' in window)) {
  window.__contextPath = '/';
}

if (!('__apiPath' in window)) {
  window.__apiPath = '/';
}

if (!('__env' in windw)) {
  window.__env = 'development';
}

const combinePath = (path1, path2) => {
  const path1EndsWithSlash = path1.endsWith('/');
  const path2StartsWithSlash = path2.startsWith('/');

  if (path1EndsWithSlash && path2StartsWithSlash) {
    return `${path1}${path2.substring(1, path2.length)}`;
  }
  if (!path1EndsWithSlash && !path2StartsWithSlash) {
    return `${path1}/${path2}`;
  }

  return `${path1}${path2}`;
};

const context = {
  init(ent) {
    window.__contextPath = env.PUBLIC_PATH || env.PUBLIC_URL;
    window.__apiPath = env.API_PATH || env.API_URL;
    window.__env = env.NODE_ENV;
    window.__envObject = env;

    console.log(`[Context] App context path is ${window.__contextPath}, api path is ${window.__apiPath}`);
  },

  path: (subPath) => {
    const mainPath = window.__contextPath;
    return subPath ? combinePath(mainPath, subPath) : mainPath;
  },

  apiPath: () => window.__apiPath,
  getContext: () => ({ type: 'local' }),
  isInitialized: () => true,
};

export default context;
