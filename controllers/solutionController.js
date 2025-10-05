import Solution from "../models/Solution.js";

/**
 * @route GET /api/solutions
 * @desc Get all solutions for the logged-in user
 */
export const getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch solutions" });
  }
};

/**
 * @route POST /api/solutions
 * @desc Add a new solution
 */
export const addSolution = async (req, res) => {
  try {
    const { title, description, timeframe } = req.body;
    
    // CRITICAL: Validation check for the required 'title' field
    if (!title || title.trim() === '') {
      // Return 400 if title is missing or empty
      return res.status(400).json({ message: "Solution title is required." });
    }

    const solution = await Solution.create({
      title,
      description: description,
      timeframe: timeframe || "This Week",
      user: req.user._id,
    });
    res.status(201).json(solution);
  } catch (error) {
    // If the error is *not* a validation error, it's likely a 500 or Auth failure
    console.error("Add solution error:", error);
    res.status(500).json({ message: error.message || "Failed to add solution" });
  }
};

/**
 * @route PUT /api/solutions/:id
 * @desc Update a solution (title, description, or timeframe)
 */
export const updateSolution = async (req, res) => {
  try {
    const updated = await Solution.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id }, // Ensure it belongs to the user
        {
            $set: {
                title: req.body.title,
                description: req.body.description,
                timeframe: req.body.timeframe
            }
        },
        { new: true, runValidators: true } // Return updated document & run validators
    );
    
    if (!updated) {
        return res.status(404).json({ message: "Solution not found or unauthorized to update" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update solution" });
  }
};

/**
 * @route DELETE /api/solutions/:id
 * @desc Delete a solution
 */
export const deleteSolution = async (req, res) => {
  try {
    const deleted = await Solution.findOneAndDelete({ 
        _id: req.params.id, 
        user: req.user._id 
    });

    if (!deleted) {
        return res.status(404).json({ message: "Solution not found or unauthorized to delete" });
    }

    res.json({ message: "Solution deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete solution" });
  }
};
