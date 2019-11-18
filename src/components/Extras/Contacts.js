import React, { useState, useEffect } from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Card, CardBody, CardFooter, Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios";

const ContactCard = props => {

    const handleOpen = () => {
        props.handleOpen(props.id, props.name, props.lastName, props.email);
    }

    return (
        <div>
            <Card className="card-default">
                <CardBody className="text-center">
                    <img className="mb-2 img-fluid rounded-circle thumb64" src={props.imgsrc} alt="Contact" />
                    <h4>{props.name} {props.lastName}</h4>
                    <p>{props.email}</p>
                </CardBody>
                <CardFooter className="d-flex">
                    <div className="ml-auto">
                        <Button variant="contained" color="primary" data-name="test" onClick={handleOpen}>
                            Edit
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

const ContactDialog = props => {

    const [user, setUser] = useState({
        ...props.user
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        // send a PUT request
        axios({
            method: 'put',
            url: 'https://reqres.in/api/users/' + props.id,
            data: {
                name: user.name,
                lastName: user.lastName
            }
        }).then(response => {
            console.log(response);
            props.handleClose();
        }).catch(error => {
            console.error(error);
        });
    }

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{user.name} {user.lastName}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    User ID: {user.id}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    value={user.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    type="text"
                    fullWidth
                    value={user.lastName}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={user.email}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                    </Button>
                <Button type="button" color="primary" onClick={handleSubmit}>
                    Save
                    </Button>
            </DialogActions>
        </Dialog>
    );
}

function Contacts() {

    useEffect(() => {
        fetchItems();
    }, []);

    const [items, setItems] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);

    const fetchItems = async () => {
        const data = await fetch('https://reqres.in/api/users');

        const items = await data.json();

        setItems(items.data);
    }

    const handleClose = () => {
        setOpen(false);
        setUser(null);
    };

    const handleOpen = (id, name, lastName, email) => {
        setUser({
            id,
            name,
            lastName,
            email
        });

        setOpen(true);
    }

    return (
        <ContentWrapper>
            <div className="content-heading">Contacts
                <div className="ml-auto">
                    <Dropdown isOpen={dropdownOpen} toggle={() => { setDropdownOpen(!dropdownOpen) }}>
                        <DropdownToggle color="link">
                            <em className="fa fa-ellipsis-v fa-lg"></em>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-right-forced animated fadeInLeft">
                            <DropdownItem>
                                <em className="fa-fw fa fa-plus mr-2"></em>
                                <span>New contact</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            {user && <ContactDialog open={open} handleClose={handleClose} user={user} ></ContactDialog>}
            <Row>
                {items.map((item, index) => (
                    <Col key={index} lg="4" sm="6">
                        <ContactCard id={item.id} imgsrc={item.avatar}
                            name={item.first_name}
                            lastName={item.last_name}
                            email={item.email}
                            handleOpen={handleOpen} />
                    </Col>
                ))}
            </Row>
        </ContentWrapper >
    );
}

export default Contacts;
