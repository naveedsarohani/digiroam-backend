const formatDatetime = (loginTime) => {
    const date = new Date(loginTime);

    // Options for formatting
    const options = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        // timeZoneName: "short", // Show timezone
    };

    return date.toLocaleString("en-US", options);
};

export default formatDatetime;