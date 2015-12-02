/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */
// Adds the systems that shape your system
systems({
  azkdemo: {
    // Dependent systems
    depends: [],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/node"},
    // Steps to execute before running instances
    provision: [
      "npm install",
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: ["npm", "start"],
    wait: 20,
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
    ports: {
      // exports global variables
      http: "3000/tcp",
    },
    envs: {
      // Make sure that the PORT value is the same as the one
      // in ports/http below, and that it's also the same
      // if you're setting it in a .env file
      NODE_ENV: "dev",
      PORT: "3000",
    },
  },
  // **ADD THE FOLLOWING, OUTSIDE OF THE AZKDEMO SYSTEM:**
  // Adds the "redis" system
  redis: {
    image: { docker: "redis" },
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
      BOX_IMAGE                : "14665943",
      // HOST_DOMAIN              : "demo.azk.io",
      REMOTE_PROJECT_PATH_ID   : "azkdemo",
      ENV_FILE                 : ".env",
      GIT_REF                  : "azkfile",
      DISABLE_ANALYTICS_TRACKER: true,
    },
  },
});
