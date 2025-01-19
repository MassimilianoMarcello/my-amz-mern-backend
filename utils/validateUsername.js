const validateUsername = (username) => {
    const re = /^[a-zA-Z0-9]{3,}$/;
    return re.test(username);
};

export default validateUsername;
