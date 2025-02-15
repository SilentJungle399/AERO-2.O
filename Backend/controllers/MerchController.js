const MerchModel = require("../models/MerchModel");

const createOrder = async (req, res) => {
  try {
    const url = req.body.fileDownloadURL;
    // const url = '';

    const { user_id, full_name, phone, customName, email, items, total_price } = req.body;
    let parsedItems = JSON.parse(items);
    parsedItems.T_Shirt = parsedItems["T-Shirt"];
    const newOrder = new MerchModel({
      user_id,
      full_name,
      phone,
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

const getOrders = async (req, res) => {
  try {
    const merch = await MerchModel.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json(merch);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching merchandise', details: error.message });
  }
};



module.exports = { createOrder, getOrders } ;
