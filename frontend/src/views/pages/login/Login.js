import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { loginQuery } from '../../../hooks/useUsers'
import { toast } from 'react-toastify'

const Login = () => {
  const initialVal = { email: '', password: '' }

  const [formData, setFormData] = useState(initialVal)
  const loginMutation = loginQuery()
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault()
    const data = {
      email: formData.email,
      password: formData.password,
    }

    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Connecté avec succès.')
        navigate('/');
      }, onError: (error) => {
        toast.error(error.message || 'Une erreur est survenue.')
      }
    })
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={onSubmit}>
                    <h1>Se connecter</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    <CInputGroup className="mb-3" >
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput type="email" placeholder="Email" value={formData?.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </CInputGroup>



                    <CInputGroup className="mb-4 ">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"

                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }

                      />
                    </CInputGroup>



                    <CRow>
                      <CCol >
                        <CButton disabled={loginMutation.isPending} color="primary" className="px-4" type="submit">

                          <div className="d-flex gap-1 align-items-center justify-content-end">
                            {loginMutation.isPending && <CSpinner size="sm" />}{" "}
                            <span>Se connecter</span>
                          </div>

                        </CButton>



                      </CCol>

                    </CRow>


                  </CForm>
                  {loginMutation.isError && <CAlert color="danger" className='mb-0 mt-2'>{loginMutation.error.message}</CAlert>}


                </CCardBody>
              </CCard>

            </CCardGroup>
          </CCol>

        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
