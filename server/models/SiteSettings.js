const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    requireItemApproval: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

