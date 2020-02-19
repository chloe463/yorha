export default {
  input: "./dist/esm2015/index.js",
  output: {
    file: "./dist/esm2015/use-form-group.js",
    format: "es",
    name: "use-form-group",
  },
  external: ["react", "react-dom"],
};
