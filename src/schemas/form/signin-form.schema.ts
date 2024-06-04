import * as Yup from "yup";

const signInSchema = Yup.object().shape({
  email: Yup.string().email().required("Email field must not be empty"),
  password: Yup.string()
    .min(8, "Password should be at least 8 characters long")
    .required("Password is required"),
});

export default signInSchema;
