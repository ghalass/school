import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

const mockUsers = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '123456789',
    address: '123 Main St',
    userType: 'Admin',
    isActive: true,
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '987654321',
    address: '456 Elm St',
    userType: 'Teacher',
    isActive: false,
  },
]

const UsersPage = () => {
  const [users, setUsers] = useState(mockUsers)
  const [visible, setVisible] = useState(false)
  const [editUser, setEditUser] = useState(null)

  const handleOpenModal = (user = null) => {
    setEditUser(user)
    setVisible(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newUser = Object.fromEntries(formData.entries())
    newUser.isActive = newUser.isActive === 'true'

    if (editUser) {
      // update
      setUsers(users.map((u) => (u.id === editUser.id ? { ...editUser, ...newUser } : u)))
    } else {
      // create
      setUsers([...users, { id: Date.now().toString(), ...newUser }])
    }
    setVisible(false)
    setEditUser(null)
  }

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  return (
    <CContainer fluid>
      <CCard className="mt-4">
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol>
              <h5>Gestion des Utilisateurs</h5>
            </CCol>
            <CCol className="text-end">
              <CButton color="primary" onClick={() => handleOpenModal()}>
                + Ajouter
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nom</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Téléphone</CTableHeaderCell>
                <CTableHeaderCell>Adresse</CTableHeaderCell>
                <CTableHeaderCell>Type</CTableHeaderCell>
                <CTableHeaderCell>Statut</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users.map((user) => (
                <CTableRow key={user.id}>
                  <CTableDataCell>
                    {user.firstName} {user.lastName}
                  </CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>{user.phone}</CTableDataCell>
                  <CTableDataCell>{user.address}</CTableDataCell>
                  <CTableDataCell>{user.userType}</CTableDataCell>
                  <CTableDataCell>
                    {user.isActive ? (
                      <span className="badge bg-success">Actif</span>
                    ) : (
                      <span className="badge bg-danger">Inactif</span>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      color="info"
                      className="me-2"
                      onClick={() => handleOpenModal(user)}
                    >
                      Éditer
                    </CButton>
                    <CButton size="sm" color="danger" onClick={() => handleDelete(user.id)}>
                      Supprimer
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal Add/Edit */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CForm onSubmit={handleSave}>
          <CModalHeader>
            <CModalTitle>{editUser ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CFormInput
              type="text"
              name="firstName"
              label="Prénom"
              defaultValue={editUser?.firstName || ''}
              className="mb-3"
              required
            />
            <CFormInput
              type="text"
              name="lastName"
              label="Nom"
              defaultValue={editUser?.lastName || ''}
              className="mb-3"
              required
            />
            <CFormInput
              type="email"
              name="email"
              label="Email"
              defaultValue={editUser?.email || ''}
              className="mb-3"
              required
            />
            <CFormInput
              type="text"
              name="phone"
              label="Téléphone"
              defaultValue={editUser?.phone || ''}
              className="mb-3"
            />
            <CFormInput
              type="text"
              name="address"
              label="Adresse"
              defaultValue={editUser?.address || ''}
              className="mb-3"
            />
            <CFormSelect
              name="userType"
              label="Type"
              defaultValue={editUser?.userType || 'Student'}
              className="mb-3"
              options={[
                { label: 'Étudiant', value: 'Student' },
                { label: 'Professeur', value: 'Teacher' },
                { label: 'Admin', value: 'Admin' },
              ]}
            />
            <CFormSelect
              name="isActive"
              label="Statut"
              defaultValue={editUser?.isActive ? 'true' : 'false'}
              className="mb-3"
              options={[
                { label: 'Actif', value: 'true' },
                { label: 'Inactif', value: 'false' },
              ]}
            />
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Annuler
            </CButton>
            <CButton color="primary" type="submit">
              Sauvegarder
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </CContainer>
  )
}

export default UsersPage
