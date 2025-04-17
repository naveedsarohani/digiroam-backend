const randomString = (length = 16) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    return Array.from({ length }).reduce((acc, _) => acc + chars[Math.floor(Math.random() * chars.length)], "");
};

export default randomString; 