const validator = require('validator');

const validateSignUpData = (req) => {
    const { UserId, Name, Email, Age, Gender, Password } = req.body;
    const allowedGenders = ['Male', 'Female', 'Other', 'Non-binary'];
    if (!Name)
        throw new Error('Name is not Valid!');
    else if (!validator.isEmail(Email)) {
        throw new Error("Email is invalid!");
    }
    else if (!validator.isStrongPassword(Password)) {
        throw new Error("Please enter a strong Password!")
    }
    else if (!validator.isNumeric((Age))) {
        throw new Error("Please enter a valid age.")
    }
    else if (!Gender || !allowedGenders.includes(Gender)) {
        return res.status(400).send(`Gender must be one of the following: ${allowedGenders.join(', ')}`);
    }
}
const validateEditProfileData = (req) => {
    const allowedEditFields = ["Name", "Email", "Gender", "Age"];
    const isEdidAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    )
    return isEdidAllowed;
}

module.exports = { validateSignUpData, validateEditProfileData }