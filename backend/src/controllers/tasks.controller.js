import taskModel from "../models/task.model.js";

async function list(req, res) {
  try {
    const tasks = await taskModel.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar tasks" });
  }
}

export default {
  list,
};
