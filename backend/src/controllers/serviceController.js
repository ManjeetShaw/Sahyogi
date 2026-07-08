import Service from "../models/Service.js";
import SavedService from "../models/SavedService.js";

export async function listServices(req, res, next) {
  try {
    const { category, q } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.$text = { $search: q };

    const services = await Service.find(filter).sort({ title: 1 });
    res.json({ services });
  } catch (err) {
    next(err);
  }
}

export async function getService(req, res, next) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found." });
    res.json({ service });
  } catch (err) {
    next(err);
  }
}

export async function createService(req, res, next) {
  try {
    const {
      title, description, category, howToApply,
      eligibility, requiredDocuments, fees, commonRejectionReasons, link,
    } = req.body;
    if (!title || !description || !category || !howToApply) {
      return res.status(400).json({ message: "Title, description, category, and howToApply are required." });
    }
    const service = await Service.create({
      title, description, category, howToApply,
      eligibility, requiredDocuments, fees, commonRejectionReasons, link,
      createdBy: req.user.id,
    });
    res.status(201).json({ service });
  } catch (err) {
    next(err);
  }
}

export async function updateService(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ message: "Service not found." });
    res.json({ service });
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req, res, next) {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found." });
    res.json({ message: "Service deleted." });
  } catch (err) {
    next(err);
  }
}

export async function saveService(req, res, next) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found." });

    await SavedService.updateOne(
      { user: req.user.id, service: service._id },
      { $setOnInsert: { user: req.user.id, service: service._id } },
      { upsert: true }
    );
    res.status(201).json({ message: "Service saved." });
  } catch (err) {
    next(err);
  }
}

export async function unsaveService(req, res, next) {
  try {
    await SavedService.deleteOne({ user: req.user.id, service: req.params.id });
    res.json({ message: "Service removed from saved list." });
  } catch (err) {
    next(err);
  }
}

export async function listSavedServices(req, res, next) {
  try {
    const saved = await SavedService.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("service");

    const services = saved.filter((s) => s.service).map((s) => s.service);
    res.json({ services });
  } catch (err) {
    next(err);
  }
}
