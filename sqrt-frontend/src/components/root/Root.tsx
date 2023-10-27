import React from "react";
import { Card } from "react-bootstrap";
import "./root.css"
const Root = () => {
    return (

       <div className="card d-flex align-items-center justify-content-center">
            <Card.Body>
                <Card.Title>Welcome to Matthew Fiorella's Sample Application</Card.Title>
                <Card.Text>
                    From this application we can lookup the primary healthcare trusts associated with
                    postal codes and we can calculate square roots
                </Card.Text>
            </Card.Body>
        </div>
            
    )
}
export default Root