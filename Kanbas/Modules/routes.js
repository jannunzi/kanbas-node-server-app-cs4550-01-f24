import * as modulesDao from "./dao.js";
export default function ModuleRoutes(app, openai) {
  app.delete("/api/modules/:moduleId", async (req, res) => {
    const { moduleId } = req.params;
    const status = await modulesDao.deleteModule(moduleId);
    res.send(status);
  });
  const suggestModule = async (req, res) => {
    const { courseName, courseDescription, modules } = req.body;
    const systemMessage = {
      role: "system",
      content:
        "You are a Web API that only responds in JSON objects. I provide a course name, course description and existing array of module names. You respond with a String of the name of a new module that would logically follow the modules provided. Do not respond with JSON, only a string",
    };
    const message = {
      role: "user",
      content: `Give me the name of a module that would logically follow the modules ${modules.join(
        ", "
      )} for the course ${courseName} with the description "${courseDescription}".`,
    };
    if (modules.length === 0) {
      message.content = `Give me the name of the first module for the course ${courseName} with the description "${courseDescription}".`;
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [systemMessage, message],
    });
    const moduleName = response.choices[0].message.content;
    res.json(moduleName);
  };
  app.post("/api/modules/ai", suggestModule);
}
