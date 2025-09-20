import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, gql } from '@apollo/client'

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardLink,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { AtSign, ContactRound, MapPinHouse, PencilLine, Phone, Users } from 'lucide-react'
import { useAuthContext } from '../../../hooks/useAuthContext'
import * as Yup from 'yup'

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      email
      firstName
      lastName
      userType
    }
  }
`
// ✅ Définition du schéma Yup
const validationSchema = Yup.object().shape({
  email: Yup.string().email("Format d'email invalide").required().label("L'email"),
  firstName: Yup.string().required().label('Le prénom'),
  lastName: Yup.string().required().label('Le nom'),
  phone: Yup.string().nullable(), // Optionnel
  address: Yup.string().nullable(), // Optionnel
  userType: Yup.string().required().label("Le type d'utilisateur"),
})

const ProfilePage = () => {
  const { id } = useParams()
  const { user } = useAuthContext()
  const [visible, setVisible] = useState(false)

  const {
    data: getUserByIdData,
    loading: getUserByIdLoading,
    refetch,
  } = useQuery(GET_USER_BY_ID, {
    variables: { id: id },
  })

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    userType: '',
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (getUserByIdData?.getUserById) {
      setFormData({
        email: getUserByIdData.getUserById.email || '',
        firstName: getUserByIdData.getUserById.firstName || '',
        lastName: getUserByIdData.getUserById.lastName || '',
        phone: getUserByIdData.getUserById.phone || '',
        address: getUserByIdData.getUserById.address || '',
        userType: getUserByIdData.getUserById.userType || '',
      })
    }
  }, [getUserByIdData])

  const USER_TYPE = ['STUDENT', 'TEACHER', 'SUPER_ADMIN', 'ADMIN', 'PARENT', 'VISITOR']

  // // Validation du formulaire
  // const validateForm = (data) => {
  //   const errors = {}

  //   if (!data.email.trim()) {
  //     errors.email = "L'email est requis"
  //   } else if (!/\S+@\S+\.\S+/.test(data.email)) {
  //     errors.email = "Format d'email invalide"
  //   }
  //   if (!data.firstName.trim()) errors.firstName = 'Le prénom est requis'
  //   if (!data.lastName.trim()) errors.lastName = 'Le nom est requis'

  //   // if (modalMode === 'create' && !data.password.trim()) {
  //   //   errors.password = 'Le mot de passe est requis'
  //   // }
  //   if (!data.userType) errors.userType = "Le type d'utilisateur est requis"

  //   return errors
  // }

  // Gestionnaires d'événements
  const handleOpenModal = (user) => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      userType: user.userType,
    })

    setFormErrors({})
    setVisible(true)
  }

  const handleCloseModal = () => {
    setVisible(false)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      userType: 'VISITOR',
    })
    setFormErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await validationSchema.validate(formData, { abortEarly: false })
      setFormErrors({})
      console.log('✅ Données valides :', formData)
      // 👉 Ici tu peux appeler ton update user mutation
    } catch (err) {
      if (err.inner) {
        const errors = {}
        err.inner.forEach((e) => {
          errors[e.path] = e.message
        })
        setFormErrors(errors)
      }
    }
  }

  return (
    <div>
      <div>
        {getUserByIdLoading ? (
          <p> Loading user...</p>
        ) : (
          <>
            {getUserByIdData.getUserById && (
              <>
                <CCard>
                  <CCardBody>
                    <CCardTitle className="d-flex justify-content-between">
                      <div className="d-flex align-items-center gap-1">
                        <span>Profile</span>
                        {user.userId === id && (
                          <CBadge textBgColor="info" shape="rounded-pill">
                            Vous
                          </CBadge>
                        )}
                      </div>
                      <div>
                        {user.userId === id && (
                          <CButton
                            size="sm"
                            color="primary"
                            variant="outline"
                            className="rounded-pill d-flex align-items-center p-2"
                            onClick={() => handleOpenModal(getUserByIdData.getUserById)}
                          >
                            <PencilLine size={'15'} />
                          </CButton>
                        )}
                      </div>
                    </CCardTitle>
                    <CCardSubtitle className="mb-2 text-body-secondary d-flex align-items-center gap-1">
                      <ContactRound size={20} />
                      {getUserByIdData.getUserById?.firstName +
                        ' ' +
                        getUserByIdData.getUserById?.lastName}
                    </CCardSubtitle>
                    <CCardText className="d-flex align-items-center gap-1">
                      <AtSign size={15} />
                      {getUserByIdData.getUserById?.email}
                    </CCardText>
                    <CCardText className="d-flex align-items-center gap-1">
                      <Phone size={15} />
                      {getUserByIdData.getUserById?.phone}
                    </CCardText>
                    <CCardText className="d-flex align-items-center gap-1">
                      <MapPinHouse size={15} />
                      {getUserByIdData.getUserById?.address}
                    </CCardText>
                    <CCardText className="d-flex align-items-center gap-1">
                      <Users size={15} />
                      {getUserByIdData.getUserById?.userType}
                    </CCardText>
                  </CCardBody>
                </CCard>
              </>
            )}
          </>
        )}
      </div>

      <CModal
        backdrop="static"
        visible={visible}
        onClose={handleCloseModal}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Gestion de profile</CModalTitle>
        </CModalHeader>

        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow xs={{ gutter: 2 }}>
              <CCol md>
                <CFormInput
                  type="email"
                  id="floatingInputGridEmail"
                  floatingLabel="Email"
                  placeholder="name@example.com"
                  invalid={!!formErrors.email}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {formErrors.email && <div className="text-danger small">{formErrors.email}</div>}
              </CCol>

              <CCol md>
                <CFormInput
                  id="floatingInputGridfirstName"
                  floatingLabel="Nom"
                  placeholder="name@example.com"
                  invalid={!!formErrors.firstName}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                {formErrors.firstName && (
                  <div className="text-danger small">{formErrors.firstName}</div>
                )}
              </CCol>

              <CCol md>
                <CFormInput
                  id="floatingInputGridlastName"
                  floatingLabel="Prénom"
                  placeholder="name@example.com"
                  invalid={!!formErrors.lastName}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                {formErrors.lastName && (
                  <div className="text-danger small">{formErrors.lastName}</div>
                )}
              </CCol>

              <CCol md>
                <CFormInput
                  id="floatingInputGridphone"
                  floatingLabel="Numéro de Téléphone"
                  placeholder="name@example.com"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                {formErrors.phone && <div className="text-danger small">{formErrors.phone}</div>}
              </CCol>

              <CCol md>
                <CFormTextarea
                  id="floatingInputGridaddress"
                  floatingLabel="Addresse"
                  placeholder="name@example.com"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                {formErrors.address && (
                  <div className="text-danger small">{formErrors.address}</div>
                )}
              </CCol>

              <CCol md>
                <CFormSelect
                  id="floatingSelectGrid"
                  floatingLabel="Rôle"
                  aria-label="Works with selects"
                  invalid={!!formErrors.userType}
                  value={formData.userType}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                >
                  <option value="">--Choisir un rôle--</option>
                  {USER_TYPE.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </CFormSelect>
                {formErrors.userType && (
                  <div className="text-danger small">{formErrors.userType}</div>
                )}
              </CCol>
            </CRow>
          </CModalBody>

          <CModalFooter>
            <CButton size="sm" color="secondary" variant="outline" onClick={handleCloseModal}>
              Annuler
            </CButton>
            <CButton size="sm" color="primary" variant="outline" type="submit">
              Save
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  )
}

export default ProfilePage
