import React from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import './App.css';
import { BuscarLibrosPagina } from './DiseñoPagina/BuscarLibrosPagina/BuscarLibrosPagina';
import { InicioPagina } from './DiseñoPagina/InicioPagina/InicioPagina';
import { Footer } from './DiseñoPagina/Navbar&Footer/Footer';
import { Navbar } from './DiseñoPagina/Navbar&Footer/Navbar';
import { SeccionLibro } from './DiseñoPagina/InfoLibro/SeccionLibro';
import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ListaResenaPage } from './DiseñoPagina/ListaResenas/ListaResenaPage';
import { TusPrestamosPage } from './DiseñoPagina/TusPrestamos/TusPrestamosPage';
import { MensajesPagina } from './DiseñoPagina/MensajesPagina/MensajesPagina';
import { AdministrarLibreriaPagina } from './DiseñoPagina/AdministrarLibreriaPagina/AdministrarLibreriaPagina';

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {

  const customAuthHandler = () => {
    history.push('/login');
  }

  const history = useHistory();

  const restoreOriginalUrl = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUrl} onAuthRequired={customAuthHandler}>
        <Navbar />
        <div className='flex-grow-1'>
          <Switch>
            <Route path='/' exact>
              <Redirect to='/home' />
            </Route>
            <Route path='/home' exact>
              <InicioPagina />
            </Route>
            <Route path='/buscar'>
              <BuscarLibrosPagina />
            </Route>
            <Route path='/resenas/:id'>
              <ListaResenaPage />
            </Route>
            <Route path='/info/:id'>
              <SeccionLibro />
            </Route>
            <Route path='/login' render={() => <LoginWidget config={oktaConfig} />} />
            <Route path='/login/callback' component={LoginCallback} />

            <SecureRoute path='/tusprestamos'>
              <TusPrestamosPage />
            </SecureRoute>
            <SecureRoute path='/mensajes'>
              <MensajesPagina />
            </SecureRoute>

            <SecureRoute path='/administracion'>
              <AdministrarLibreriaPagina />
            </SecureRoute>
          </Switch>
        </div>
        <Footer />
      </Security>
    </div>
  );
}
