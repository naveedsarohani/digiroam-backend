import transactionService from "../services/transaction.service.js";

const retrieveAll = async (req, res) => {
    try {
        const transactions = await transactionService.retrieve(req.user._id);
        return res.response(200, "The all your transaction documents", { transactions });
    } catch (error) {
        return res.response(500, "Internal server error", { error: error.message });
    }
};

export default { retrieveAll };
