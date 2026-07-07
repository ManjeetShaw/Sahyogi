import Issue, { ISSUE_STATUSES } from "../models/Issue.js";

export async function listIssues(req, res, next) {
  try {
    const { status, category, mine } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (mine === "true") filter.reportedBy = req.user.id;

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .populate("reportedBy", "name");

    res.json({ issues });
  } catch (err) {
    next(err);
  }
}

export async function getIssue(req, res, next) {
  try {
    const issue = await Issue.findById(req.params.id).populate("reportedBy", "name");
    if (!issue) return res.status(404).json({ message: "Issue not found." });
    res.json({ issue });
  } catch (err) {
    next(err);
  }
}

export async function createIssue(req, res, next) {
  try {
    const { title, description, category, location, imageUrl } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required." });
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      imageUrl,
      reportedBy: req.user.id,
      statusHistory: [{ status: "submitted", changedBy: req.user.id }],
    });

    res.status(201).json({ issue });
  } catch (err) {
    next(err);
  }
}

export async function updateIssueStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!ISSUE_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${ISSUE_STATUSES.join(", ")}` });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found." });

    issue.status = status;
    issue.statusHistory.push({ status, changedBy: req.user.id });
    await issue.save();

    res.json({ issue });
  } catch (err) {
    next(err);
  }
}

export async function deleteIssue(req, res, next) {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found." });

    const isOwner = issue.reportedBy.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You can only delete issues you reported." });
    }

    await issue.deleteOne();
    res.json({ message: "Issue deleted." });
  } catch (err) {
    next(err);
  }
}
