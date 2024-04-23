
const Booking = require("../../models/Schedule/Booking.js");

exports.addContactDetails = async (req, res) => {
    const { Name, Email, Mobile_No, dateValidity, Message,  Package_Name } = req.body;
  
    try {
      // Check if the date is already booked
      const existingDetail = await Booking.findOne({ dateValidity });
  
      if (existingDetail) {
        return res.status(400).json({ error: 'This date is already booked. Please choose another date.' });
      }
  
      // If date is not booked, proceed to add contact details
      const newContact = new Booking({
        Name,
        Email,
        Mobile_No,
        dateValidity,
        Message,
        Package_Name
      });
  
      await newContact.save();
      res.json('Details are Added');
    } catch (error) {
      console.error('Error adding contact details:', error);
      res.status(500).json({ error: 'An error occurred while adding contact details.' });
    }
};
exports.assignPhotographer = async (req, res) => {
  console.log("Inside assignPhotographer function");

  try {
    const { phoname, bookingId } = req.body;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Assign the photographer name to the booking
    booking.phoname = phoname;
    await booking.save();

    res.status(200).json({ message: "Photographer assigned successfully", booking });
  } catch (error) {
    console.error("Error assigning photographer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


  
  exports.getExistingDates = async (req, res) => {
    const selectedDate = req.params.date;
  
    try {
      const existingDetail = await Booking.findOne({ dateValidity: selectedDate });
      res.json({ exists: existingDetail !== null });
    } catch (error) {
      console.error('Error checking date availability:', error);
      res.status(500).json({ error: 'An error occurred while checking date availability' });
    }
  };
  
exports.getContactDetails = (req, res) => {
    Booking.find()
        .then((contactMessages) => {
            res.json(contactMessages);
        })
        .catch((err) => {
            console.error("Error fetching contact details:", err);
            res.status(500).json({ error: "An error occurred while fetching contact details." });
        });
};

exports.deleteContact = async (req, res) => {
    const contactId = req.params.id;

    try {
        await Booking.findByIdAndDelete(contactId);
        res.status(200).send({ status: "Customer contact deleted" });
    } catch (err) {
        console.error("Error deleting contact:", err);
        res.status(500).send({ status: "Error with delete data", error: err.message });
    }
};

exports.getContactById = async (req, res) => {
    const contactId = req.params.id;

    try {
        const contact = await Booking.findById(contactId);
        res.status(200).send({ status: "Contact fetched", contact });
    } catch (err) {
        console.error("Error fetching contact:", err);
        res.status(500).send({ status: "Error with get contact", error: err.message });
    }
};

exports.updateBooking = async (req, res) => {
  const bookingId = req.params.id;
  const updatedData = req.body;

  try {
      // Find the booking by ID and update its details
      const booking = await Booking.findByIdAndUpdate(bookingId, updatedData, { new: true });

      if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
      }

      res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};



////////////////////////////////////////////////////////////////////////////////







// exports.getDetails = async (req, res) => {
//   try {
//     const userEmail = req.user.Email;
//     const bookings = await Booking.find({ Email: userEmail });
//     res.json(bookings);
//   } catch (error) {
//     console.error("Error fetching bookings:", error.message); // Access the error message
//     res.status(500).json({ error: "An error occurred while fetching bookings." });
//   }
  
// };
exports.getDetails = (req, res) => {
  // Retrieve the user's email from req.body
  const userEmail = req.params.email; // Assuming the email is stored in req.body.Email
  
  // Find bookings associated with the logged-in user's email
  Booking.find({ Email: userEmail }) // Assuming the field in the database is 'Email'
    .then((bookings) => {
      res.json(bookings);
    })
    .catch((err) => {
      console.error("Error fetching bookings:", err);
      res.status(500).json({ error: "An error occurred while fetching bookings." });
    });
};


