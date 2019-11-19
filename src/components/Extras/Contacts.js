import React, { useState, useEffect } from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardFooter, Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import axios from "axios";
import moment from 'moment';

const useStyles = makeStyles(theme => ({
    close: {
        padding: theme.spacing(0.5),
    },
}));

const ContactCard = props => {

    const handleOpen = () => {
        props.handleOpen(props.id, props.first_name, props.last_name, props.email);
    }

    return (
        <div>
            <Card className="card-default">
                <CardBody className="text-center">
                    <img className="mb-2 img-fluid rounded-circle thumb64" src={props.avatar} alt="Contact" />
                    <h4>{props.first_name} {props.last_name}</h4>
                    <p>{props.email}</p>
                    {props.updatedAt &&
                        <div className="muted">
                            {`Updated At: ${moment(props.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}`}
                        </div>
                    }

                    {!props.updatedAt &&
                        <div>&nbsp;</div>
                    }
                </CardBody>
                <CardFooter className="d-flex">

                    {!props.newUser && (<div className="mr-auto">
                        <Link to={'/contacts/' + props.id}>
                            <Button variant="contained" color="primary" onClick={handleOpen}>
                                View
                        </Button>
                        </Link>
                    </div>)}
                    <div className="ml-auto">
                        <Button variant="contained" color="secondary" onClick={handleOpen}>
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

        if (props.user.id) {
            // send a PUT request
            axios({
                method: 'put',
                url: 'https://reqres.in/api/users/' + props.user.id,
                data: {
                    id: props.user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }
            }).then(response => {
                props.handleClose(response.data);
            }).catch(error => {
                console.error(error);
            });
        } else {
            axios({
                method: 'post',
                url: 'https://reqres.in/api/users/',
                data: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }
            }).then(response => {
                props.handleClose(response.data);
            }).catch(error => {
                console.error(error);
            });
        }
    }

    const handleChanges = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <form onSubmit={handleSubmit}>
                {user.id && (<DialogTitle id="form-dialog-title">
                    {user.first_name + " " + user.last_name}
                </DialogTitle>)}
                {!user.id && (<DialogTitle id="form-dialog-title"> New Contact </DialogTitle>)}
                <DialogContent>
                    {user.id && <DialogContentText>
                        User ID: {user.id}
                    </DialogContentText>
                    }
                    <TextField
                        autoFocus
                        margin="dense"
                        id="first_name"
                        name="first_name"
                        label="Name"
                        type="text"
                        fullWidth
                        required
                        value={user.first_name}
                        onChange={handleChanges}
                    />
                    <TextField
                        margin="dense"
                        id="last_name"
                        label="Last Name"
                        name="last_name"
                        type="text"
                        fullWidth
                        value={user.last_name}
                        onChange={handleChanges}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        required
                        value={user.email}
                        onChange={handleChanges}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

function Contacts() {

    useEffect(() => {
        fetchItems();
    }, []);

    const classes = useStyles();
    const [items, setItems] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [openMessage, setOpenMessage] = useState(false);

    const fetchItems = async () => {
        const data = await fetch('https://reqres.in/api/users');
        const items = await data.json();

        setItems(items.data);
    }

    const handleClose = (user) => {
        const foundIndex = items.findIndex(item => item.id === user.id);

        if (foundIndex >= 0) {
            user.avatar = items[foundIndex].avatar;
            items[foundIndex] = user;

            setItems(items);
            setMessage("Contact Updated");

        } else if (user.id) {
            setItems([
                {
                    newUser: true,
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    avatar: 'https://randomuser.me/api/portraits/med/men/1.jpg'
                },
                ...items
            ]);
            setMessage("Contact Created");
        }

        setUser(null);
        setOpenMessage(true);
        setOpen(false);
    };

    const handleOpen = (id, first_name, last_name, email) => {
        setUser({
            id,
            first_name,
            last_name,
            email
        });

        setOpen(true);
    }

    const handleCloseMessage = () => {
        setOpenMessage(false);
    };

    const handleNewContact = () => {
        setUser({
            first_name: "",
            last_name: "",
            email: ""
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
                            <DropdownItem onClick={handleNewContact}>
                                <em className="fa-fw fa fa-plus mr-2"></em>
                                <span>New contact</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            {user && <ContactDialog open={open} handleClose={handleClose} user={user} ></ContactDialog>}
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={openMessage}
                autoHideDuration={6000}
                onClose={handleCloseMessage}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{message}</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        className={classes.close}
                        onClick={handleCloseMessage}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
            <Row>
                {items.map((item, index) => (
                    <Col key={index} lg="4" sm="6">
                        <ContactCard
                            newUser={item.newUser}
                            id={item.id}
                            avatar={item.avatar}
                            updatedAt={item.updatedAt}
                            first_name={item.first_name}
                            last_name={item.last_name}
                            email={item.email}
                            handleOpen={handleOpen} />
                    </Col>
                ))}
            </Row>
        </ContentWrapper >
    );
}

export default Contacts;
