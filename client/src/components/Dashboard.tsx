import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

interface Service {
  name: string;
  status: 'online' | 'offline' | 'warning';
  url: string;
}

interface DashboardData {
  message: string;
  user: string;
  services: Service[];
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/dashboard');
      setDashboardData(response.data);
      setFilteredServices(response.data.services);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to static data if API fails
      setDashboardData({
        message: 'Welcome to the dashboard!',
        user: user?.username || 'User',
        services: [
          { name: 'Immich Photos', status: 'online', url: 'http://photos.shvydak.com' },
          { name: 'Portainer', status: 'online', url: 'http://portainer.shvydak.com' },
          { name: 'n8n', status: 'online', url: 'http://n8n.shvydak.com' },
          { name: 'Home Assistant', status: 'online', url: 'http://homeassistant.shvydak.com' },
          { name: 'Pi-hole', status: 'online', url: 'http://pihole.shvydak.com/admin' },
          { name: 'Plex', status: 'offline', url: 'http://plex.shvydak.com' },
          { name: 'Transmission', status: 'offline', url: 'http://torrents.shvydak.com' }
        ]
      });
      setFilteredServices([
        { name: 'Immich Photos', status: 'online', url: 'http://photos.shvydak.com' },
        { name: 'Portainer', status: 'online', url: 'http://portainer.shvydak.com' },
        { name: 'n8n', status: 'online', url: 'http://n8n.shvydak.com' },
        { name: 'Home Assistant', status: 'online', url: 'http://homeassistant.shvydak.com' },
        { name: 'Pi-hole', status: 'online', url: 'http://pihole.shvydak.com/admin' },
        { name: 'Plex', status: 'offline', url: 'http://plex.shvydak.com' },
        { name: 'Transmission', status: 'offline', url: 'http://torrents.shvydak.com' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (dashboardData?.services) {
      const filtered = dashboardData.services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchTerm, dashboardData]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getServiceIcon = (serviceName: string) => {
    const iconMap: { [key: string]: string } = {
      'Immich Photos': 'fas fa-images',
      'Portainer': 'fab fa-docker',
      'n8n': 'fas fa-project-diagram',
      'Home Assistant': 'fas fa-home',
      'Pi-hole': 'fas fa-shield-alt',
      'Plex': 'fas fa-play-circle',
      'Transmission': 'fas fa-download'
    };
    return iconMap[serviceName] || 'fas fa-server';
  };

  const getServiceGradient = (serviceName: string) => {
    const gradientMap: { [key: string]: string } = {
      'Immich Photos': 'gradient-primary',
      'Portainer': 'gradient-secondary',
      'n8n': 'gradient-accent',
      'Home Assistant': 'gradient-home',
      'Pi-hole': 'gradient-pihole',
      'Plex': 'gradient-plex',
      'Transmission': 'gradient-transmission'
    };
    return gradientMap[serviceName] || 'gradient-primary';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return 'fas fa-external-link-alt';
      case 'offline':
        return 'fas fa-clock';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-question';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'online':
        return 'status-online';
      case 'offline':
        return 'status-offline';
      case 'warning':
        return 'status-warning';
      default:
        return 'status-unknown';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="background-animation"></div>
      
      <main className="container">
        <header className="header">
          <div className="logo">
            <i className="fas fa-server"></i>
            <h1>Shvydak's Dashboard</h1>
          </div>
          <p className="subtitle">Manage your services and applications</p>
          
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <button onClick={handleLogout} className="logout-button">
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </header>

        <div className="search-container">
          <div className="search-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search services"
            />
            <div className="search-results-count">
              {searchTerm && `${filteredServices.length} service${filteredServices.length !== 1 ? 's' : ''}`}
            </div>
          </div>
        </div>

        <section className="services-grid">
          {filteredServices.map((service, index) => (
            <div 
              key={service.name}
              className={`service-card ${getServiceGradient(service.name)}`}
              data-service={service.name.toLowerCase().replace(/\s+/g, '-')}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`status-indicator ${getStatusClass(service.status)}`}></div>
              
              <div className="service-icon">
                <i className={getServiceIcon(service.name)}></i>
              </div>
              
              <div className="service-content">
                <h3>{service.name}</h3>
                <p>{service.status === 'online' ? 'Service is running' : 'Service is offline'}</p>
              </div>
              
              <a 
                href={service.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`service-link ${service.status === 'offline' ? 'disabled' : ''}`}
                title={service.status === 'offline' ? 'Service is currently offline' : `Open ${service.name}`}
              >
                <i className={getStatusIcon(service.status)}></i>
              </a>
            </div>
          ))}
        </section>

        <footer className="footer">
          <p>&copy; 2024 Shvydak Dashboard. Made with <i className="fas fa-heart"></i></p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
