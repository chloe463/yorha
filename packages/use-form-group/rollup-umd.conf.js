export default {
  input: "./dist/esm5/index.js",
  output: {
    file: "./dist/bundle/use-form-group.umd.js",
    format: "umd",
    name: "use-form-group",
    globals: {
      react: "react",
      "react-dom": "react-dom",
    },
  },
  external: ["react", "react-dom"],
};
