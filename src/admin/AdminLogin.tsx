import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Sesión iniciada');
      navigate('/admin');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      const messages: Record<string, string> = {
        'auth/user-not-found': 'Usuario no encontrado. Verifica el email.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-credential': 'Credenciales inválidas. Verifica email y contraseña.',
        'auth/invalid-email': 'Email inválido.',
        'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
        'auth/network-request-failed': 'Error de red. Verifica tu conexión.',
        'auth/configuration-not-found': 'Email/Password no está habilitado en Firebase Console.',
      };
      toast.error(messages[code] || `Error: ${code || 'desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <div className="admin-login__logo">
          <img src="/imagenes/logo.png" alt="Agencia de Viajes Martínez" />
        </div>
        <h1 className="admin-login__title">Panel de Administración</h1>
        <p className="admin-login__sub">Ingresa tus credenciales para continuar</p>

        <div className="admin-login__field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@myjtravels.com"
            required
          />
        </div>

        <div className="admin-login__field">
          <label>Contraseña</label>
          <div className="admin-login__pass-wrap">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="admin-login__toggle-pass"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
            >
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button className="admin-login__btn" type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}
