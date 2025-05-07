
import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { getUserByToken, login } from '../core/_requests'
import { useAuth } from '../core/Auth'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  email: '',
  password: '',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        //console.log(values)
        const { data: auth } = await login(values.email.toLocaleLowerCase(), values.password)
        saveAuth(auth)
        console.log(auth)
        const { data: user } = await getUserByToken(auth._id)
        setCurrentUser(user)
       // console.log(user)
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('The login details are incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <>
    <form className="form w-100"   onSubmit={formik.handleSubmit}
        noValidate id='kt_login_signin_form'>
								<div className="card-body">
									<div className="text-start mb-10">
										<h1 className="text-light mb-3 fs-3x " data-kt-translate="sign-in-title">Iniciar Sesión</h1>
										<div className="text-light  fs-6" data-kt-translate="general-desc">Complete sus datos.</div>
									</div>
									<div className="fv-row mb-8">
                    <input autoFocus
                    placeholder='Codigo Usuario'
                    {...formik.getFieldProps('email')}
                    className={clsx(
                      'form-control bg-white',
                      { 'is-invalid': formik.touched.email && formik.errors.email },
                      {
                        'is-valid': formik.touched.email && !formik.errors.email,
                      }
                    )}
                    type='text'
                    name='email'
                    autoComplete='off'
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className='fv-plugins-message-container'>
                      <span role='alert'>{formik.errors.email}</span>
                    </div>
                  )}
									</div>
									<div className="fv-row mb-7">
                    <input
                    type='password'
                    autoComplete='off'
                    {...formik.getFieldProps('password')}
                    className={clsx(
                      'form-control bg-white',
                      {
                        'is-invalid': formik.touched.password && formik.errors.password,
                      },
                      {
                        'is-valid': formik.touched.password && !formik.errors.password,
                      }
                    )}
                  />
									</div>
									<div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-10">
                  <div className='fv-row mb-3'>
                  
                  {formik.touched.password && formik.errors.password && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                        <span role='alert'>{formik.errors.password}</span>
                      </div>
                    </div>
                  )}
                  {formik.status ? (
                    <div className='mb-lg-15 alert alert-danger'>
                      <div className='alert-text font-weight-bold'>{formik.status}</div>
                    </div>
                  ) : (
                    <div >
                    </div>
                  )}
                </div>
										
									</div>
									<div className="d-flex flex-stack">
                    <button
                    type='submit'
                    id='kt_sign_in_submit'
                    className='btn btn-dark btn-lg text-light fw-bold'
                    disabled={formik.isSubmitting || !formik.isValid}
                  >
                    {!loading && <span className='indicator-label'>-Iniciar Sesión-</span>}
                    {loading && (
                      <span className='indicator-progress' style={{ display: 'block' }}>
                        Cargando...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
									 
										<div className="d-flex align-items-center">
                     	
										</div>
									</div>
                  <div className='d-flex flex-column-fluid'>
                   
                  </div>
								</div>
							</form>
    
    </>

  )
}
