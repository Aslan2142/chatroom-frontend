import React from 'react';
import { Container, Jumbotron } from 'react-bootstrap';

function Page404(props) {
    return (
        <div>
            <Container fluid="lg" className="top-margin">
                <Jumbotron>
                    <h1>Error 404</h1>
                    <hr/>
                    <h4>Page <code>{props.path}</code> not found!</h4>
                </Jumbotron>
            </Container>
        </div>
    )
}

export default Page404;