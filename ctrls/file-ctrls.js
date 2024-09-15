export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).send("no files uploaded");
    else {
      const paths = {};
      req.files.forEach((file) => (paths[file.originalname] = file.path));
      res.status(201).send({ data: paths, message: "files uploaded successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};
