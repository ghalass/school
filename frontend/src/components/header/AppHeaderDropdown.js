import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilUser,
  cilPowerStandby,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { toast } from 'react-toastify'
import avatar8 from './../../assets/images/avatars/8.jpg'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });

    toast.success('Déconnecté avec succès.');
    navigate('/login');
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 px-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>


        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>

        <CDropdownDivider />
        <CDropdownItem as={'button'} onClick={handleLogout} >
          <CIcon icon={cilPowerStandby} className="me-2" />
          Se déconnecter
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
