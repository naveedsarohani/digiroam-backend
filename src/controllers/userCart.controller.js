import Cart from "../app/models/cart.model.js";


const getCartDetails = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json({ success: true, message: "get all Cart", cart });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const addToCart = async (req, res) => {
    const { productId, productName, productPrice, productQuantity } = req.body;

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
        cart = new Cart({ userId: req.user._id, items: [], totalPrice: 0 });
    }

    const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (productIndex > -1) {
        cart.items[productIndex].productQuantity += productQuantity;
    } else {
        cart.items.push({ productId, productName, productPrice, productQuantity });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.productQuantity * item.productPrice, 0);
    await cart.save();

    res.status(200).json(cart);

}

// const removeFromCart = async (req, res) => {
//     const { userId, productId } = req.body;

//     try {
//         const cart = await Cart.findOne({ userId });
//         if (!cart) return res.status(404).json({ message: 'Cart not found' });

//         cart.items = cart.items.filter(item => item.productId.toString() !== productId);
//         cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * 10, 0); // Example price logic
//         await cart.save();

//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// }

const removeFromCart = async (req, res) => {
    const { productId } = req.body;


    try {
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove the product from the cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        // Calculate the total price with additional validation
        cart.totalPrice = cart.items.reduce((total, item) => {
            // Ensure productPrice and productQuantity are valid numbers
            const price = item.productPrice || 0; // Default to 0 if productPrice is invalid
            const quantity = item.productQuantity || 0; // Default to 0 if productQuantity is invalid
            return total + price * quantity;
        }, 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const clearCart = async (req, res) => {
    try {
        // Find the user's cart
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Clear all items from the cart and reset the total price
        cart.items = [];
        cart.totalPrice = 0;

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export {
    getCartDetails,
    addToCart,
    removeFromCart,
    clearCart
}