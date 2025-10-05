import Mistake from "../models/Mistakes.js";

/**
 * @route GET /api/mistakes
 * @desc Get all mistakes for the logged-in user
 */
export const getMistakes = async (req, res) => {
  try {
    // Only fetch mistakes belonging to the logged-in user (req.user._id is set by the 'protect' middleware)
    const mistakes = await Mistake.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(mistakes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch mistakes" });
  }
};

/**
 * @route POST /api/mistakes
 * @desc Add a new mistake
 */
export const addMistake = async (req, res) => {
  try {
    const { task, priority } = req.body;
    
    // CRITICAL: Validation check for the required 'task' field
    if (!task || task.trim() === '') {
      return res.status(400).json({ message: "Mistake task content is required." });
    }

    const mistake = await Mistake.create({
      task,
      priority: priority || "medium",
      user: req.user._id,
    });
    res.status(201).json(mistake);
  } catch (error) {
    console.error("Add mistake error:", error);
    res.status(500).json({ message: error.message || "Failed to add mistake" });
  }
};

/**
 * @route PUT /api/mistakes/:id
 * @desc Update a mistake (task, priority, or completed status)
 */
export const updateMistake = async (req, res) => {
  try {
    // findOneAndUpdate with user check ensures authorization and ownership validation
    const updated = await Mistake.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id }, 
        {
            $set: {
                task: req.body.task,
                priority: req.body.priority,
                // Only update 'completed' if it's explicitly provided
                completed: req.body.completed
            }
        },
        // new: true returns the updated document; runValidators ensures data integrity
        { new: true, runValidators: true } 
    );
    
    if (!updated) {
        return res.status(404).json({ message: "Mistake not found or unauthorized to update" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update mistake" });
  }
};

/**
 * @route DELETE /api/mistakes/:id
 * @desc Delete a mistake
 */
export const deleteMistake = async (req, res) => {
  try {
    const deleted = await Mistake.findOneAndDelete({ 
        _id: req.params.id, 
        user: req.user._id // Authorization check
    });

    if (!deleted) {
        return res.status(404).json({ message: "Mistake not found or unauthorized to delete" });
    }

    res.json({ message: "Mistake deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete mistake" });
  }
};
