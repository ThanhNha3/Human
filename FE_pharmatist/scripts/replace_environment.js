//replace_environment_variables.js file
const fs = require("fs");

// read template file as string
let template_environment = fs.readFileSync("./src/environments/environment.prod.template.ts").toString();

// for every keys you have defined on environment this will loop over them and replace the values accordingly
Object.keys(process.env).forEach(env_var => {
  template_environment = template_environment.replace("${" + env_var + "}",process.env[env_var])
});

console.log(template_environment);

fs.writeFileSync("./src/environments/environment.prod.ts", template_environment);
