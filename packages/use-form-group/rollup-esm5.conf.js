export default {
  input: "./dist/esm5/index.js",
  output: {
    file: "./dist/esm5/use-form-group.js",
    format: "es",
  },
  external: ["react", "react-dom"],
};
