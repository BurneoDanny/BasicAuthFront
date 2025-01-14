import { Link } from 'react-router-dom';
import './AccountVerified.css';
/*
 *   Vista para hacer el cambio de contraseña
 */
export default function AccountVerified() {
  return (
    <div className="accountVerified">
      <h1><b>¡Su cuenta se ha verificado!</b></h1><br />
      <Link to="/">
        <button>
          Iniciar Sesión
        </button>
      </Link>
    </div>
  );
}
