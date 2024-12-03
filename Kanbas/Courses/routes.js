import * as modulesDao from "../Modules/dao.js";
import * as dao from "./dao.js";
export default function CourseRoutes(app, openai) {
  const suggestCourse = async (req, res) => {
    const { name, description } = req.body;
    const systemMessage = {
      role: "system",
      content:
        "You are a Web API that only responds in JSON objects. I provide sample course names and descriptions and you respond with a JSON object with properties name and description. The only courses you know about are Computer Science courses. Do not format it with a leading 'json'. Just use plain text",
    };
    const message = {
      role: "user",
      content:
        "Give me the name and description of a random Computer Science course. Respnd with a JSON object with properties 'name' and 'description'.",
    };
    if (name && description) {
      message.content = `Give me an alternate name and description for the course "${name}" with the description "${description}". Respond with a JSON object with properties 'name' and 'description'.`;
    } else if (name) {
      message.content = `Give me a description for the course "${name}". Respond with a JSON object with a property 'description'.`;
    } else if (description) {
      message.content = `Give me a name for the course with the description "${name}". Respond with a JSON object with a property 'name'.`;
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [systemMessage, message],
    });
    const course = response.choices[0].message.content;
    console.log(course);
    res.json(course);
  };
  app.post("/api/courses/ai", suggestCourse);
  app.get("/api/courses", async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  });
  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = await modulesDao.createModule(module);
    res.send(newModule);
  });
  app.post("/api/courses", async (req, res) => {
    const course = await dao.createCourse(req.body);
    res.json(course);
  });
  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  });
  app.put("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  });
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });
}
