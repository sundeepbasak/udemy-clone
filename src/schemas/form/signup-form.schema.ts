import * as Yup from 'yup'

const signupSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(3)
    .max(25)
    .required('Name field must not be empty'),
  email: Yup.string().email().required('Email field must not be empty'),
  password: Yup.string()
    .min(8, 'Password should be at least 8 characters long')
    .required('Password is required'),
})

export default signupSchema
