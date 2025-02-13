const MerchModel = require("../models/MerchModel");

const createOrder = async (req, res) => {
  try {
    // const url = req.body.fileDownloadURL;
    const url = '';

    const { user_id, full_name, contact, customName, email, items, total_price } = req.body;
    let parsedItems = JSON.parse(items);
    parsedItems.T_Shirt = parsedItems["T-Shirt"];
    const newOrder = new MerchModel({
      user_id,
      full_name,
      contact,
      email,
      customName,
      items: parsedItems, 
      total_price,
      payment_screenshot: url,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error while placing order:", error);
    res.status(500).json({ error: "Failed to place order", details: error.message });
  }
};

module.exports = { createOrder };
