
import { Payment } from "../models/paymentSave.model.js";
import { Cart } from "../models/cart.model.js";
import { ApiError } from "../utils/ApiError.js";



const paymentStore = async (req, res, next) => {

    const {
        transactionId,
        amount,
        currency,
        payer,
        packageInfoList,
        orderNo
    } = req.body;


    if (!transactionId || !amount || !packageInfoList || !orderNo) {
        throw new ApiError(400, "All Fields are require.");
    }



    try {


        // Check if the payment already exists
        const existingPayment = await Payment.findOne({ transactionId });
        if (existingPayment) {
            throw new ApiError(409, "Payment with this transaction ID already exists.");
        }

        // Save the payment to the database
        const payment = await Payment.create({
            userId: req.user._id,
            transactionId,
            amount,
            currency: currency || "USD",
            status: "COMPLETED",
            payer,
            packageInfoList,
            orderNo,
        });



        // Clear the user's cart
        await Cart.findOneAndDelete({ userId: req.user._id });

        res.status(201).json({
            success: true,
            message: "Payment stored successfully, and cart cleared.",
            payment,
        });


    } catch (error) {
        next(error);
    }

}

const getMyPaymentsInfo=async (req,res,next)=>{
    try {
        const myPayments=await Payment.find({userId:req.user._id})

        res.status(200).json({
            success: true,
            message: "successfully get all payments info",
            myPayments,
        });
    } catch (error) {
        next(new ApiError(400,"Error occur while getting payment ",error.message))
    }
}

const esimWebHook=async(req,res,next)=>{
    try {
        const { notifyType, content } = req.body;

        if (!notifyType || !content) {
            return res.status(400).json({ error: "Invalid webhook payload" });
        }

        const { orderNo, transactionId, iccid, remain, esimStatus, smdpStatus, totalVolume, expiredTime } = content;

      
        const payment = await Payment.findOne({ orderNo });

        if (!payment) {
            return res.status(404).json({ error: "Payment record not found for the given orderNo" });
        }

      
        switch (notifyType) {
            case "ORDER_STATUS":
                // Example: You might want to log the order status or update a field in the payment record
                console.log(`Order ${orderNo} status: ${content.orderStatus}`);
                break;

            case "ESIM_STATUS":
                if (esimStatus === "CANCEL" || smdpStatus === "RELEASED") {
                    payment.status = "CANCELLED";
                } else if (esimStatus === "IN_USE") {
                    payment.status = "COMPLETED";
                }
                break;

            case "DATA_USAGE":
                console.log(`Data usage alert for eSIM with ICCID ${iccid}. Remaining data: ${remain}MB`);
               
                break;

            case "VALIDITY_USAGE":
                console.log(`Validity alert for eSIM with ICCID ${iccid}. Remaining days: ${remain}`);
              
                break;

            default:
                console.log(`Unhandled notifyType: ${notifyType}`);
                break;
        }

      
        await payment.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}


export { paymentStore,getMyPaymentsInfo,esimWebHook }
