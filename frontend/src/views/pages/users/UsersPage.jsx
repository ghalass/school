// src/views/users/Users.js
import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CButton,
  CButtonGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CPagination,
  CPaginationItem,
  CSpinner,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPeople,
  cilUserPlus,
  cilPencil,
  cilTrash,
  cilSearch,
  cilUser,
  cilEnvelopeClosed,
  cilPhone,
  cilLocationPin,
  cilLockLocked,
} from '@coreui/icons'

// Hook personnalisé pour gérer les utilisateurs
const useUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Simulation d'API - À remplacer par vos appels Prisma
  const fetchUsers = async (page = 1, limit = 10, search = '') => {
    setLoading(true)
    try {
      // Simulation de données - remplacez par votre API
      const mockUsers = [
        {
          id: '1',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@ecole.fr',
          phone: '0123456789',
          address: '123 Rue de la Paix, Paris',
          userType: 'TEACHER',
          isActive: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          firstName: 'Marie',
          lastName: 'Martin',
          email: 'marie.martin@ecole.fr',
          phone: '0987654321',
          address: '456 Avenue des Champs, Lyon',
          userType: 'STUDENT',
          isActive: true,
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20'),
        },
        {
          id: '3',
          firstName: 'Pierre',
          lastName: 'Durand',
          email: 'pierre.durand@ecole.fr',
          phone: '0147258369',
          address: '789 Boulevard Victor Hugo, Marseille',
          userType: 'ADMIN',
          isActive: false,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-25'),
        },
      ]

      // Simulation de pagination et recherche
      let filteredUsers = mockUsers
      if (search) {
        filteredUsers = mockUsers.filter(
          (user) =>
            user.firstName.toLowerCase().includes(search.toLowerCase()) ||
            user.lastName.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()),
        )
      }

      setTimeout(() => {
        setUsers(filteredUsers)
        setLoading(false)
      }, 500)
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs')
      setLoading(false)
    }
  }

  const createUser = async (userData) => {
    setLoading(true)
    try {
      // Simulation de création - remplacez par votre API Prisma
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setUsers((prev) => [newUser, ...prev])
      setLoading(false)
      return { success: true, data: newUser }
    } catch (err) {
      setError("Erreur lors de la création de l'utilisateur")
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  const updateUser = async (id, userData) => {
    setLoading(true)
    try {
      // Simulation de mise à jour
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, ...userData, updatedAt: new Date() } : user,
        ),
      )
      setLoading(false)
      return { success: true }
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'utilisateur")
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  const deleteUser = async (id) => {
    setLoading(true)
    try {
      // Simulation de suppression
      setUsers((prev) => prev.filter((user) => user.id !== id))
      setLoading(false)
      return { success: true }
    } catch (err) {
      setError("Erreur lors de la suppression de l'utilisateur")
      setLoading(false)
      return { success: false, error: err.message }
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}

// Composant principal
const Users = () => {
  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUsers()

  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [toasts, setToasts] = useState([])

  // Formulaire state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    userType: 'STUDENT',
    isActive: true,
  })

  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchUsers(currentPage, itemsPerPage, searchTerm)
  }, [currentPage, searchTerm])

  // Ajouter une notification toast
  const addToast = (message, color = 'success') => {
    const toast = (
      <CToast key={Date.now()} autohide delay={4000} visible={true} color={color}>
        <CToastHeader closeButton>
          <strong className="me-auto">Notification</strong>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    )
    setToasts((prev) => [...prev, toast])
  }

  // Validation du formulaire
  const validateForm = (data) => {
    const errors = {}

    if (!data.firstName.trim()) errors.firstName = 'Le prénom est requis'
    if (!data.lastName.trim()) errors.lastName = 'Le nom est requis'
    if (!data.email.trim()) {
      errors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Format d'email invalide"
    }
    if (modalMode === 'create' && !data.password.trim()) {
      errors.password = 'Le mot de passe est requis'
    }
    if (!data.userType) errors.userType = "Le type d'utilisateur est requis"

    return errors
  }

  // Gestionnaires d'événements
  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode)
    setSelectedUser(user)

    if (mode === 'create') {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        userType: 'STUDENT',
        isActive: true,
      })
    } else if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        phone: user.phone || '',
        address: user.address || '',
        userType: user.userType,
        isActive: user.isActive,
      })
    }

    setFormErrors({})
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedUser(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      userType: 'STUDENT',
      isActive: true,
    })
    setFormErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    let result
    if (modalMode === 'create') {
      result = await createUser(formData)
    } else if (modalMode === 'edit') {
      result = await updateUser(selectedUser.id, formData)
    }

    if (result.success) {
      addToast(
        modalMode === 'create'
          ? 'Utilisateur créé avec succès'
          : 'Utilisateur mis à jour avec succès',
        'success',
      )
      handleCloseModal()
    } else {
      addToast(result.error || 'Une erreur est survenue', 'danger')
    }
  }

  const handleDelete = async (user) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ?`)) {
      const result = await deleteUser(user.id)
      if (result.success) {
        addToast('Utilisateur supprimé avec succès', 'success')
      } else {
        addToast('Erreur lors de la suppression', 'danger')
      }
    }
  }

  const getUserTypeColor = (type) => {
    switch (type) {
      case 'ADMIN':
        return 'danger'
      case 'TEACHER':
        return 'warning'
      case 'STUDENT':
        return 'info'
      case 'PARENT':
        return 'secondary'
      default:
        return 'primary'
    }
  }

  const getUserTypeLabel = (type) => {
    switch (type) {
      case 'ADMIN':
        return 'Administrateur'
      case 'TEACHER':
        return 'Enseignant'
      case 'STUDENT':
        return 'Étudiant'
      case 'PARENT':
        return 'Parent'
      default:
        return type
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <CIcon icon={cilPeople} size="lg" className="me-2" />
                <strong>Gestion des Utilisateurs</strong>
              </div>
              <CButton
                color="primary"
                onClick={() => handleOpenModal('create')}
                className="d-flex align-items-center"
              >
                <CIcon icon={cilUserPlus} className="me-1" />
                Nouvel Utilisateur
              </CButton>
            </CCardHeader>
            <CCardBody>
              {/* Barre de recherche */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilSearch} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Rechercher par nom, prénom ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CInputGroup>
                </CCol>
              </CRow>

              {/* Affichage des erreurs */}
              {error && (
                <CAlert color="danger" dismissible onClose={() => setError(null)}>
                  {error}
                </CAlert>
              )}

              {/* Tableau des utilisateurs */}
              {loading ? (
                <div className="text-center py-4">
                  <CSpinner color="primary" />
                  <div className="mt-2">Chargement...</div>
                </div>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead className="text-nowrap">
                    <CTableRow>
                      <CTableHeaderCell className="bg-body-tertiary">
                        <CIcon icon={cilUser} />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Nom complet</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Email</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Téléphone</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Type</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Statut</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Créé le</CTableHeaderCell>
                      <CTableHeaderCell className="bg-body-tertiary">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {users.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="8" className="text-center py-4">
                          Aucun utilisateur trouvé
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      users.map((user) => (
                        <CTableRow key={user.id}>
                          <CTableDataCell>
                            <div className="d-flex align-items-center">
                              <div
                                className="avatar avatar-md me-3"
                                style={{
                                  backgroundColor: '#f0f0f0',
                                  borderRadius: '50%',
                                  width: '40px',
                                  height: '40px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {user.firstName.charAt(0)}
                                {user.lastName.charAt(0)}
                              </div>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div>
                              <strong>
                                {user.firstName} {user.lastName}
                              </strong>
                            </div>
                          </CTableDataCell>
                          <CTableDataCell>{user.email}</CTableDataCell>
                          <CTableDataCell>{user.phone || '-'}</CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={getUserTypeColor(user.userType)}>
                              {getUserTypeLabel(user.userType)}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={user.isActive ? 'success' : 'danger'}>
                              {user.isActive ? 'Actif' : 'Inactif'}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButtonGroup role="group" size="sm">
                              <CButton
                                color="info"
                                variant="outline"
                                onClick={() => handleOpenModal('view', user)}
                                title="Voir"
                              >
                                <CIcon icon={cilUser} />
                              </CButton>
                              <CButton
                                color="warning"
                                variant="outline"
                                onClick={() => handleOpenModal('edit', user)}
                                title="Modifier"
                              >
                                <CIcon icon={cilPencil} />
                              </CButton>
                              <CButton
                                color="danger"
                                variant="outline"
                                onClick={() => handleDelete(user)}
                                title="Supprimer"
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </CButtonGroup>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              )}

              {/* Pagination */}
              {users.length > 0 && (
                <div className="d-flex justify-content-center mt-3">
                  <CPagination>
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Précédent
                    </CPaginationItem>
                    <CPaginationItem active>{currentPage}</CPaginationItem>
                    <CPaginationItem onClick={() => setCurrentPage(currentPage + 1)}>
                      Suivant
                    </CPaginationItem>
                  </CPagination>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Modal Créer/Modifier/Voir */}
      <CModal size="lg" visible={showModal} onClose={handleCloseModal} backdrop="static">
        <CModalHeader>
          <CModalTitle>
            {modalMode === 'create' && 'Créer un utilisateur'}
            {modalMode === 'edit' && "Modifier l'utilisateur"}
            {modalMode === 'view' && "Détails de l'utilisateur"}
          </CModalTitle>
        </CModalHeader>

        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="firstName">
                    <CIcon icon={cilUser} className="me-1" />
                    Prénom *
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    invalid={!!formErrors.firstName}
                    disabled={modalMode === 'view'}
                  />
                  {formErrors.firstName && (
                    <div className="text-danger small">{formErrors.firstName}</div>
                  )}
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="lastName">
                    <CIcon icon={cilUser} className="me-1" />
                    Nom *
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    invalid={!!formErrors.lastName}
                    disabled={modalMode === 'view'}
                  />
                  {formErrors.lastName && (
                    <div className="text-danger small">{formErrors.lastName}</div>
                  )}
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="email">
                    <CIcon icon={cilEnvelopeClosed} className="me-1" />
                    Email *
                  </CFormLabel>
                  <CFormInput
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    invalid={!!formErrors.email}
                    disabled={modalMode === 'view'}
                  />
                  {formErrors.email && <div className="text-danger small">{formErrors.email}</div>}
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="phone">
                    <CIcon icon={cilPhone} className="me-1" />
                    Téléphone
                  </CFormLabel>
                  <CFormInput
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={modalMode === 'view'}
                  />
                </div>
              </CCol>
            </CRow>

            {modalMode !== 'view' && (
              <div className="mb-3">
                <CFormLabel htmlFor="password">
                  <CIcon icon={cilLockLocked} className="me-1" />
                  Mot de passe {modalMode === 'create' ? '*' : '(laisser vide pour ne pas changer)'}
                </CFormLabel>
                <CFormInput
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  invalid={!!formErrors.password}
                />
                {formErrors.password && (
                  <div className="text-danger small">{formErrors.password}</div>
                )}
              </div>
            )}

            <div className="mb-3">
              <CFormLabel htmlFor="address">
                <CIcon icon={cilLocationPin} className="me-1" />
                Adresse
              </CFormLabel>
              <CFormTextarea
                id="address"
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={modalMode === 'view'}
              />
            </div>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel htmlFor="userType">Type d'utilisateur *</CFormLabel>
                  <CFormSelect
                    id="userType"
                    value={formData.userType}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    invalid={!!formErrors.userType}
                    disabled={modalMode === 'view'}
                  >
                    <option value="STUDENT">Étudiant</option>
                    <option value="TEACHER">Enseignant</option>
                    <option value="ADMIN">Administrateur</option>
                    <option value="PARENT">Parent</option>
                  </CFormSelect>
                  {formErrors.userType && (
                    <div className="text-danger small">{formErrors.userType}</div>
                  )}
                </div>
              </CCol>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Statut</CFormLabel>
                  <div className="mt-2">
                    <CFormCheck
                      id="isActive"
                      label="Utilisateur actif"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      disabled={modalMode === 'view'}
                    />
                  </div>
                </div>
              </CCol>
            </CRow>

            {modalMode === 'view' && selectedUser && (
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Créé le</CFormLabel>
                    <CFormInput
                      value={new Date(selectedUser.createdAt).toLocaleString('fr-FR')}
                      disabled
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <CFormLabel>Modifié le</CFormLabel>
                    <CFormInput
                      value={new Date(selectedUser.updatedAt).toLocaleString('fr-FR')}
                      disabled
                    />
                  </div>
                </CCol>
              </CRow>
            )}
          </CModalBody>

          <CModalFooter>
            <CButton color="secondary" onClick={handleCloseModal}>
              {modalMode === 'view' ? 'Fermer' : 'Annuler'}
            </CButton>
            {modalMode !== 'view' && (
              <CButton color="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    {modalMode === 'create' ? 'Création...' : 'Modification...'}
                  </>
                ) : modalMode === 'create' ? (
                  'Créer'
                ) : (
                  'Modifier'
                )}
              </CButton>
            )}
          </CModalFooter>
        </CForm>
      </CModal>

      {/* Toast notifications */}
      <CToaster className="p-3" placement="top-end">
        {toasts}
      </CToaster>
    </>
  )
}

export default Users
