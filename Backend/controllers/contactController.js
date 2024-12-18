const Contact = require("../Models/Contact");

const contactForm = async (req, res) => {
  try {
    const { name, phone, email, address, message } = req.body;

    if (!name || !phone || !email || !address || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await Contact.create({ name, phone, email, address, message });
    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error retrieving contact data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteContactForm = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteContact = await Contact.findByIdAndDelete(id);
        if (!deleteContact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        res.status(200).json({ message: "Contact deleted" });
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { contactForm, getAllContacts, deleteContactForm };
