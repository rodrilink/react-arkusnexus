import React, { Suspense, lazy } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

/* loader component for Suspense*/
import PageLoader from './components/Common/PageLoader';
import Base from './components/Layout/Base';

/* Used to render a lazy component with react-router */
const waitFor = Tag => props => <Tag {...props} />;
const ContactDetails = lazy(() => import('./components/Extras/ContactDetails'));
const Contacts = lazy(() => import('./components/Extras/Contacts'));

const Routes = ({ location }) => {
    const currentKey = location.pathname.split('/')[1] || '/';
    const timeout = { enter: 500, exit: 500 };

    // Animations supported
    //      'rag-fadeIn'
    //      'rag-fadeInRight'
    //      'rag-fadeInLeft'

    const animationName = 'rag-fadeIn';

    return (
        // Layout component wrapper
        <Base>
            <TransitionGroup>
                <CSSTransition key={currentKey} timeout={timeout} classNames={animationName} exit={false}>
                    <div>
                        <Suspense fallback={<PageLoader />}>
                            <Switch location={location}>
                                <Route path="/contacts" exact component={waitFor(Contacts)} />
                                <Route path="/contacts/:id" component={waitFor(ContactDetails)} />
                                <Redirect to="/contacts" />
                            </Switch>
                        </Suspense>
                    </div>
                </CSSTransition>
            </TransitionGroup>
        </Base>
    )
}

export default withRouter(Routes);