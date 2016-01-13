systems({
  azkdemo: {
    depends: ["redis"],
    image: {"docker": "azukiapp/node:4.2.1"},
    provision: [
      "npm install",
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: "npm start",
    wait: {"retry": 20, "timeout": 1000},
    mounts: {
      '/azk/#{manifest.dir}': sync("."),
      '/azk/#{manifest.dir}/node_modules': persistent("./node_modules"),
    },
    scalable: {"default": 1},
    http: {
      domains: [
        "#{env.HOST_DOMAIN}",
        "#{env.HOST_IP}",
        "#{system.name}.#{azk.default_domain}"
      ]
    },
    envs: {
      NODE_ENV: "dev",
    },
  },

  redis: {
    image: "redis:3.0.6",
    command: ["redis-server", "--appendonly", "yes"],
    mounts: {
      "/data": persistent("data"),
    },
    export_envs: {
      "DATABASE_URL": "redis://#{net.host}:#{net.port[6379]}"
    }
  },

  /* Deploy */
  // to deploy, run: `azk deploy`
  deploy: {
    image: {"docker": "azukiapp/deploy-digitalocean"},
    mounts: {
      "/azk/deploy/src"    : path("."),
      "/azk/deploy/.ssh"   : path("#{env.HOME}/.ssh"),
      "/azk/deploy/.config": persistent("deploy-config"),
    },
    scalable: {"default": 0, "limit": 0},
    envs: {
      BOX_NAME                 : "azkdemo",
      // BOX_IMAGE                : "",
      // HOST_DOMAIN              : "demo.azk.io",
      REMOTE_PROJECT_PATH_ID   : "azkdemo",
      ENV_FILE                 : ".env",
      GIT_REF                  : "final",
      DISABLE_ANALYTICS_TRACKER: true,
    },
  },
});
