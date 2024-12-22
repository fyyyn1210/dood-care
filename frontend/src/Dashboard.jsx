import React, { Component } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  LinearProgress,
  DialogTitle,
  DialogContent,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";
import { Pagination } from "@mui/material";

import swal from "sweetalert";
import { withRouter } from "./utils";
import axios from "axios";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: "",
      openProductModal: false,
      openProductEditModal: false,
      id: "",
      url_foto: "",
      desc: "",
      title: "",
      target_redirect_url: "",
      target_download_url: "",
      page: 1,
      search: "",
      products: [],
      pages: 0,
      isError: false,
      loading: false,
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      return this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getProduct();
      });
    }
  };

  getProduct = () => {
    this.setState({ loading: true });

    let data = "?";
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios
      .get(`https://dood-care.vercel.app/api/get-product${data}`, {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        this.setState({
          loading: false,
          products: res.data.products,
          pages: res.data.pages,
        });
      })
      .catch((err) => {
        // swal({
        //   text: err.response.data.errorMessage,
        //   icon: "error",
        //   type: "error",isError
        // });
        this.setState({isError: true});
        console.dir({errorWhenFetch : err.response.data})
        this.setState({ loading: false, products: [], pages: 0 }, () => {});
      });
  };


  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getProduct();
    });
  };

  logOut = () => {
    localStorage.setItem("token", null);
    // this.props.history.push('/');
    this.props.navigate("/");
  };

  onChange = (e) => {
    console.log(this.state)
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => {});
    }
    this.setState({ [e.target.name]: e.target.value }, () => {});
    if (e.target.name == "search") {
      this.setState({ page: 1 }, () => {
        this.getProduct();
      });
    }
  };

  addProduct = () => {
    const file = new FormData();
    file.append("desc", this.state.desc);
    file.append("url_foto", this.state.url_foto);
    file.append("title", this.state.title);
    file.append("target_redirect_url", this.state.target_redirect_url);
    file.append("target_download_url", this.state.target_download_url);

    axios
      .post("https://dood-care.vercel.app/api/add-product", this.state, {
        headers: {
          // "content-type": "multipart/form-data",
          token: this.state.token,
        },
      })
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });

        this.handleProductClose();
        this.setState(
          { name: "", desc: "", discount: "", price: "", file: null, page: 1 },
          () => {
            this.getProduct();
          }
        );
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        this.handleProductClose();
      });
  };

  handleProductOpen = () => {
    this.setState({
      openProductModal: true,
      id: "",
      desc: "",
      url_foto: "",
      title: "",
      target_download_url: "",
      target_redirect_url: "",
    });
  };

  handleProductClose = () => {
    this.setState({ openProductModal: false });
  };

  render() {
    if(this.state.isError) return <h1>Page Not Found!</h1>
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2>Dashboard</h2>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleProductOpen}
          >
            Add Product
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>

        {/* Add Product */}
        <Dialog
          open={this.state.openProductModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >

          <DialogTitle id="alert-dialog-title">Add Product</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="url_foto"
              value={this.state.url_foto}
              onChange={this.onChange}
              placeholder="url_foto"
              required
            />
            <br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="desc"
              value={this.state.desc}
              onChange={this.onChange}
              placeholder="Description"
              required
            />
            <br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="title"
              value={this.state.title}
              onChange={this.onChange}
              placeholder="title"
              required
            />
            <br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="target_redirect_url"
              value={this.state.target_redirect_url}
              onChange={this.onChange}
              placeholder="target_redirect_url"
              required
            />
            <br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="target_download_url"
              value={this.state.target_download_url}
              onChange={this.onChange}
              placeholder="target_download_url"
              required
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={
                this.state.target_download_url == "" ||
                this.state.desc == "" ||
                this.state.target_redirect_url == "" ||
                this.state.title == "" ||
                this.state.url_foto == ""
              }
              onClick={(e) => this.addProduct()}
              color="primary"
              autoFocus
            >
              Add Product
            </Button>
          </DialogActions>
        </Dialog>

        <br />

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Target Redirect</TableCell>
                <TableCell align="center">Target Download</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                                          {/* // req.body.url_foto &&
// req.body.desc &&
// req.body.title &&
// req.body.target_redirect_url &&
// req.body.target_download_url */}
              {this.state.products.map((row) => (
                <TableRow key={row.title}>
                  <TableCell align="center" component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="center">
                    <img
                      src={`${row.url_foto}`}
                      width="70"
                      height="70"
                    />
                  </TableCell>
                  <TableCell align="center">{row.desc}</TableCell>
                  <TableCell align="center">{row.target_redirect_url}</TableCell>
                  <TableCell align="center">{row.target_download_url}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination
            count={this.state.pages}
            page={this.state.page}
            onChange={this.pageChange}
            color="primary"
          />
        </TableContainer>
      </div>
    );
  }
}

export default withRouter(Dashboard);
