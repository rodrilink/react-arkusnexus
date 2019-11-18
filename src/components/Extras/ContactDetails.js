import React, { useEffect, useState } from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import Button from '@material-ui/core/Button';
import { Row, Col } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    close: {
        padding: theme.spacing(0.5),
    },
}));

const ContactDeleteDialog = props => {

    const handleOk = () => {

        // send a DELETE request
        axios({
            method: 'delete',
            url: 'https://reqres.in/api/users/' + props.user.id
        }).then(response => {
            props.handleClose(true);
        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Delete Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {`Are you sure you want to delete ${props.user.first_name} ?`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                    </Button>
                <Button type="button" color="secondary" onClick={handleOk}>
                    Delete
                    </Button>
            </DialogActions>
        </Dialog>
    );
}

function ContactDetails({ match }) {

    useEffect(() => {
        fetchItem();
    }, []);

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [openMessage, setOpenMessage] = useState(false);
    const [user, setUser] = useState({});
    const fetchItem = async () => {
        const fetchItem = await fetch(`https://reqres.in/api/users/${match.params.id}`)
        const item = await fetchItem.json();

        setUser(item.data);
    }

    const handleClose = (confirmation) => {

        setOpen(false);

        if (typeof confirmation == 'boolean') {
            setMessage("Contact Deleted");
            setOpenMessage(true);
        }
    };

    const handleDeleteConfirmation = () => {
        setOpen(true);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        // send a PUT request
        axios({
            method: 'put',
            url: 'https://reqres.in/api/users/' + user.id,
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        }).then(() => {
            setMessage("Contact Updated");
            setOpenMessage(true);
        }).catch(error => {
            console.error(error);
        });
    }

    const handleChanges = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const handleCloseMessage = () => {
        setOpenMessage(false);
    };

    return (
        <ContentWrapper>
            <Row>
                <Col lg="4">
                    <div className="card card-default">
                        <div className="card-body text-center">
                            <div className="py-4">
                                <img className="img-fluid rounded-circle img-thumbnail thumb96" src={user.avatar} alt="Contact" />
                            </div>
                            <h3 className="m-0 text-bold">{user.first_name} {user.last_name}</h3>
                            <div className="my-3">
                                <p>{user.email}</p>
                            </div>
                            <Button color="secondary" variant="contained" onClick={handleDeleteConfirmation}>Delete</Button>
                        </div>
                    </div>
                </Col>
                <Col lg="8">
                    <div className="card card-default">
                        <div className="card-header d-flex align-items-center">
                            <div className="d-flex justify-content-center col">
                                <div className="h4 m-0 text-center">Contact Information</div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row py-4 justify-content-center">
                                <div className="col-12 col-sm-10">
                                    <form className="form-horizontal" onSubmit={handleSubmit}>
                                        <div className="form-group row">
                                            <label className="text-bold col-xl-2 col-md-3 col-4 col-form-label text-right" htmlFor="name">Name</label>
                                            <div className="col-xl-10 col-md-9 col-8">
                                                <input className="form-control" id="first_name" name="first_name" type="text" placeholder="" defaultValue={user.first_name} onChange={handleChanges} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="text-bold col-xl-2 col-md-3 col-4 col-form-label text-right" htmlFor="lastName">Last Name</label>
                                            <div className="col-xl-10 col-md-9 col-8">
                                                <input className="form-control" id="last_name" name="last_name" type="text" placeholder="" defaultValue={user.last_name} onChange={handleChanges} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="text-bold col-xl-2 col-md-3 col-4 col-form-label text-right" htmlFor="email">Email</label>
                                            <div className="col-xl-10 col-md-9 col-8">
                                                <input className="form-control" id="email" name="email" type="email" defaultValue={user.email} onChange={handleChanges} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-md-10 offset-md-3 offset-xl-2 offset-4">
                                                <Button variant="contained" color="primary" type="submit">Update</Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <ContactDeleteDialog open={open} handleClose={handleClose} user={user} ></ContactDeleteDialog>
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
        </ContentWrapper>
    );
}

export default ContactDetails;
