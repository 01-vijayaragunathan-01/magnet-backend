import Technique from "../models/Technique.js";

// @desc    Get all techniques
// @route   GET /api/techniques
// @access  Public
export const getTechniques = async (req, res) => {
  try {
    const techniques = await Technique.find()
      .populate("user", "name email") // ✅ match your User model
      .lean(); // plain JS objects (not Mongoose docs)

    // ✅ Ensure user._id is always a string
    const formatted = techniques.map(t => ({
      ...t,
      user: {
        _id: t.user?._id?.toString(),
        name: t.user?.name,
        email: t.user?.email,
      },
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch techniques" });
  }
};

// @desc    Add new technique
// @route   POST /api/techniques
// @access  Private
export const addTechnique = async (req, res) => {
  try {
    const { title, category, description, tips } = req.body;

    const technique = await Technique.create({
      title,
      category,
      description,
      tips: Array.isArray(tips) ? tips : tips.split(",").map(t => t.trim()),
      user: req.user._id,
    });

    const populated = await technique.populate("user", "name email");
    res.status(201).json({
      ...populated.toObject(),
      user: {
        _id: populated.user._id.toString(),
        name: populated.user.name,
        email: populated.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add technique" });
  }
};

// @desc    Update technique
// @route   PUT /api/techniques/:id
// @access  Private (owner only)
export const updateTechnique = async (req, res) => {
  try {
    const technique = await Technique.findById(req.params.id);
    if (!technique) return res.status(404).json({ message: "Technique not found" });

    if (technique.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    technique.title = req.body.title || technique.title;
    technique.category = req.body.category || technique.category;
    technique.description = req.body.description || technique.description;

    if (req.body.tips) {
      technique.tips = Array.isArray(req.body.tips)
        ? req.body.tips.map(t => t.trim())
        : req.body.tips.split(",").map(t => t.trim());
    }

    const updated = await technique.save();
    const populated = await updated.populate("user", "name email");

    res.json({
      ...populated.toObject(),
      user: {
        _id: populated.user._id.toString(),
        name: populated.user.name,
        email: populated.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update technique" });
  }
};

// @desc    Delete technique
// @route   DELETE /api/techniques/:id
// @access  Private (owner only)
export const deleteTechnique = async (req, res) => {
  try {
    const technique = await Technique.findById(req.params.id);
    if (!technique) return res.status(404).json({ message: "Technique not found" });

    if (technique.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await technique.deleteOne();
    res.json({ message: "Technique deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete technique" });
  }
};
